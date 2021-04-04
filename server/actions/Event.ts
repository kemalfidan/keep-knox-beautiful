import mongoDB from "../index";
import EventSchema from "../models/Event";
import VolunteerSchema from "../models/Volunteer";
import { Types } from "mongoose";
import { Event, APIError, Volunteer, PaginatedVolunteers } from "utils/types";
import { escapeRegExp } from "utils/util";

interface Config {
    VOLS_PER_PAGE: number;
    EVENT_FIELDS_JSON: any;
    VOL_FIELDS: string;
    SORT_COND: any;
}

interface Query {
    eventId: string;
    page: number;
    totalRegistered: number;
    path: string;
    skip: number;
    limit: number;
    search?: string;
}

/**
 * @param id EventId string to identify an event in our database.
 * @returns A single event.
 */
export const getEvent = async function (id: string) {
    await mongoDB();
    if (!id || id == "") {
        throw new APIError(400, "Invalid id");
    }

    const event = await EventSchema.findById(id);
    if (!event) {
        throw new APIError(404, "Event does not exist");
    }

    return event;
};

/**
 * @returns All events.
 */
export const getEvents = async function () {
    await mongoDB();

    const events = (await EventSchema.find({})) as Event[];
    if (!events || !events.length) {
        throw new APIError(404, "No events");
    }

    return events;
};

/**
 * @param event The event to insert into our database.
 */
export const addEvent = async function (event: Event) {
    await mongoDB();
    if (!event) {
        throw new APIError(400, "Invalid event");
    }

    await EventSchema.create(event);
};

/**
 * @param id The _id of the event we want to update.
 * @param event The new event object to insert into our database.
 */
export const updateEvent = async function (id: string, event: Event) {
    await mongoDB();
    if (!id || !event) {
        throw new APIError(400, "Invalid past event or invalid event.");
    }

    const model = await EventSchema.findByIdAndUpdate(id, event);
    if (!model) {
        throw new APIError(404, "Event not found.");
    }
};

/**
 * @param id EventId of event that will be deleted
 */
export const deleteEvent = async function (id: string) {
    await mongoDB();
    if (!id || id == "") {
        throw new APIError(400, "Invalid id");
    }

    const model = await EventSchema.findByIdAndDelete(id);
    if (!model) {
        throw new APIError(404, "Event not found.");
    }
};

/**
 * @param eventId The id of the event to get volunteers from.
 * @param page Since this data is paginated, page is used to return a certain subset of the data.
 * @param search Optional parameter used to search volunteers by name.
 * @returns A limited number of volunteers in an array. The return type always includes registered
 *   vols first (if any are needed for this page), then attended vols. Also specifies the number of
 *   registered vols in the array (see PaginatedVolunteers type).
 */
export const getEventVolunteers = async function (eventId: string, page: number, search = "") {
    await mongoDB();
    const VOLS_PER_PAGE = 2;
    const EVENT_FIELDS_JSON = { _id: 1, name: 1, registeredVolunteers: 1, attendedVolunteers: 1 };
    const VOL_FIELDS = "_id name email phone";
    const SORT_COND = { name: 1 };
    let volunteers: Volunteer[] = [];
    let numberRegistered = 0;

    const config: Config = {
        VOLS_PER_PAGE: VOLS_PER_PAGE,
        EVENT_FIELDS_JSON: EVENT_FIELDS_JSON,
        VOL_FIELDS: VOL_FIELDS,
        SORT_COND: SORT_COND,
    };

    // error check page and set it to be offset from 0 (1st page will return the 0th offset of data)
    if (isNaN(page) || page < 1) {
        throw new APIError(400, "Invalid page number");
    }
    page -= 1;

    if (search) {
        // lookup allows for actual joins rather than filling docs (like populate does).
        // with this, we basically get populate with search

        // get size of registeredVolunteers
        interface aggregationRet {
            _id: string;
            numberRegistered: number;
        }
        const model: aggregationRet[] = await EventSchema.aggregate([
            { $match: { _id: Types.ObjectId(eventId) } },
            { $project: EVENT_FIELDS_JSON },
            {
                $lookup: {
                    from: VolunteerSchema.collection.name,
                    localField: "registeredVolunteers",
                    foreignField: "_id",
                    as: "registeredVolunteers",
                },
            },
            { $unwind: "$registeredVolunteers" },
            { $match: { "registeredVolunteers.name": { $regex: `.*${escapeRegExp(search)}.*`, $options: "i" } } },
            { $group: { _id: "$_id", numberRegistered: { $sum: 1 } } },
        ]);
        const totalRegistered = model[0]?.numberRegistered;
        const numberRegisteredMixed = totalRegistered % VOLS_PER_PAGE;
        const numberAttendedMixed = VOLS_PER_PAGE - numberRegisteredMixed;

        // determine what to fill the return array with
        if (totalRegistered >= (page + 1) * VOLS_PER_PAGE) {
            // return array will contain all registered vols
            const query = {
                eventId: eventId,
                page: page,
                totalRegistered: totalRegistered,
                path: "registeredVolunteers",
                skip: page * VOLS_PER_PAGE,
                limit: VOLS_PER_PAGE,
                search: search,
            };
            volunteers = await getEventVolsQueryWithSearch(query, config);

            numberRegistered = VOLS_PER_PAGE;
        } else if (totalRegistered > page * VOLS_PER_PAGE) {
            // mixed w/ registered + attended
            const registeredQuery = {
                eventId: eventId,
                page: page,
                totalRegistered: totalRegistered,
                path: "registeredVolunteers",
                skip: page * VOLS_PER_PAGE,
                limit: numberRegisteredMixed,
                search: search,
            };
            const attendedQuery = {
                eventId: eventId,
                page: page,
                totalRegistered: totalRegistered,
                path: "attendedVolunteers",
                skip: 0, // start of attendedVols so no need to skip any
                limit: numberAttendedMixed,
                search: search,
            };
            const registeredPromise = getEventVolsQueryWithSearch(registeredQuery, config);
            const attendedPromise = getEventVolsQueryWithSearch(attendedQuery, config);

            const [registered, attended] = await Promise.all([registeredPromise, attendedPromise]);
            volunteers = registered.concat(attended);
            numberRegistered = numberRegisteredMixed;
        } else {
            const query = {
                eventId: eventId,
                page: page,
                totalRegistered: totalRegistered,
                path: "attendedVolunteers",
                skip: page * VOLS_PER_PAGE - totalRegistered,
                limit: VOLS_PER_PAGE,
                search: search,
            };
            volunteers = await getEventVolsQueryWithSearch(query, config);

            numberRegistered = 0;
        }
    } else {
        // normal populate - no search
        // get size of registeredVolunteers
        interface aggregationRet {
            numberRegistered: number;
        }
        const model: aggregationRet[] = await EventSchema.aggregate([
            { $match: { _id: new Types.ObjectId(eventId) } },
            { $project: { numberRegistered: { $size: "$registeredVolunteers" } } },
        ]);
        const totalRegistered = model[0]?.numberRegistered;
        const numberRegisteredMixed = totalRegistered % VOLS_PER_PAGE;
        const numberAttendedMixed = VOLS_PER_PAGE - numberRegisteredMixed;

        // determine what to fill the return array with
        if (totalRegistered >= (page + 1) * VOLS_PER_PAGE) {
            // return array will contain all registered vols
            const query = {
                eventId: eventId,
                page: page,
                totalRegistered: totalRegistered,
                path: "registeredVolunteers",
                skip: page * VOLS_PER_PAGE,
                limit: VOLS_PER_PAGE,
            };
            console.log(query);
            const event = await getEventVolsQuery(query, config);

            volunteers = event?.registeredVolunteers as Volunteer[];
            numberRegistered = VOLS_PER_PAGE;
        } else if (totalRegistered > page * VOLS_PER_PAGE) {
            // mixed w/ registered + attended
            // both registered + attended needed, can fetch both in 1 query rather than 2
            const event = await EventSchema.findById(eventId)
                .populate({
                    path: "registeredVolunteers",
                    select: VOL_FIELDS,
                    options: {
                        sort: SORT_COND,
                        skip: page * VOLS_PER_PAGE,
                        limit: numberRegisteredMixed,
                    },
                })
                .populate({
                    path: "attendedVolunteers",
                    select: VOL_FIELDS,
                    options: {
                        sort: SORT_COND,
                        // start of attendedVols so no need to skip any
                        limit: numberAttendedMixed,
                    },
                });

            volunteers = event?.registeredVolunteers?.concat(event?.attendedVolunteers as Volunteer[]) as Volunteer[];
            numberRegistered = numberRegisteredMixed;
        } else {
            // all attended volunteers
            const query = {
                eventId: eventId,
                page: page,
                totalRegistered: totalRegistered,
                path: "attendedVolunteers",
                skip: page * VOLS_PER_PAGE - totalRegistered,
                limit: VOLS_PER_PAGE,
            };
            const event = await getEventVolsQuery(query, config);

            volunteers = event?.attendedVolunteers as Volunteer[];
            numberRegistered = 0;
        }
    }

    // return vols array and registered count
    const ret: PaginatedVolunteers = {
        volunteers: volunteers,
        registeredCount: numberRegistered,
    };
    return ret;
};

const getEventVolsQueryWithSearch = async function (query: Query, config: Config): Promise<Volunteer[]> {
    if (!query.search) {
        return [];
    }

    /* eslint @typescript-eslint/no-unsafe-assignment: "off" */
    return await EventSchema.aggregate([
        { $match: { _id: Types.ObjectId(query.eventId) } },
        { $project: config.EVENT_FIELDS_JSON },
        {
            $lookup: {
                from: VolunteerSchema.collection.name,
                localField: query.path,
                foreignField: "_id",
                as: query.path,
            },
        },
        { $unwind: `$${query.path}` },
        { $match: { [`${query.path}.name`]: { $regex: `.*${escapeRegExp(query.search)}.*`, $options: "i" } } },
        { $project: { _id: `$${query.path}._id`, name: `$${query.path}.name`, phone: `$${query.path}.phone` } },
        { $sort: config.SORT_COND },
        { $skip: query.skip },
        { $limit: query.limit },
    ]);
};

const getEventVolsQuery = async function (query: Query, config: Config) {
    return await EventSchema.findById(query.eventId).populate({
        path: query.path,
        select: config.VOL_FIELDS,
        options: {
            sort: config.SORT_COND,
            skip: query.skip,
            limit: query.limit,
        },
    });
};
