import mongoDB from "../index";
import EventSchema from "../models/Event";
import VolunteerSchema from "../models/Volunteer";
import { Types } from "mongoose";
import { Event, APIError, Volunteer, PaginatedVolunteers } from "utils/types";
import { escapeRegExp } from "utils/util";

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
    const VOL_FIELDS = "_id name email phone";
    const volunteers: Volunteer[] = [];
    const numberRegistered = 0;

    // get size of registeredVolunteers
    interface aggregationRet {
        numberRegistered: number;
    }
    const model: aggregationRet[] = await EventSchema.aggregate([
        { $match: { _id: new Types.ObjectId(eventId) } },
        { $project: { numberRegistered: { $size: "$registeredVolunteers" } } },
    ]);
    if (!model || model.length != 1) {
        throw new APIError(404, "Event not found.");
    }
    const totalRegistered = model[0]?.numberRegistered;

    // lookup allows for actual joins rather than filling docs (like populate does).
    // with this, we basically get populate with search
    const event = await EventSchema.aggregate([
        { $match: { _id: Types.ObjectId(eventId) } },
        //get size
        //limit even fields
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
        // limit vol fields
        // sort + skip + limit
    ]);

    // TODO paginate this as well

    // console.log("printing registered vols");
    // for (var i=0; i<event.length; i++) {
    //     console.log(event[i].registeredVolunteers)
    // }
    // console.log("length:", event.length);
    // console.log("event:", event);
    // volunteers = event?.registeredVolunteers as Volunteer[];

    /*
    // determine what to fill the return array with
    if (totalRegistered >= (page + 1) * VOLS_PER_PAGE) {
        // return array will contain all registered vols
        const event = await EventSchema.findById(eventId).populate({
            path: "registeredVolunteers",
            select: VOL_FIELDS,
            options: {
                sort: { name: 1 },
                skip: page * VOLS_PER_PAGE,
                limit: VOLS_PER_PAGE,
            },
        });

        volunteers = event?.registeredVolunteers as Volunteer[];
        numberRegistered = VOLS_PER_PAGE;
    } else if (totalRegistered > page * VOLS_PER_PAGE) {
        // mixed w/ registered + attended
        const numberRegisteredMixed = totalRegistered % VOLS_PER_PAGE;
        const numberAttendedMixed = VOLS_PER_PAGE - numberRegisteredMixed;
        const event = await EventSchema.findById(eventId)
            .populate({
                path: "registeredVolunteers",
                select: VOL_FIELDS,
                options: {
                    sort: { name: 1 },
                    skip: page * VOLS_PER_PAGE,
                    limit: numberRegisteredMixed,
                },
            })
            .populate({
                path: "attendedVolunteers",
                select: VOL_FIELDS,
                options: {
                    sort: { name: 1 },
                    // start of attendedVols so no need to skip any
                    limit: numberAttendedMixed,
                },
            });

        volunteers = event?.registeredVolunteers?.concat(event?.attendedVolunteers as Volunteer[]) as Volunteer[];
        numberRegistered = numberRegisteredMixed;
    } else {
        // all attended volunteers
        const numberAttendedMixed = totalRegistered % VOLS_PER_PAGE;
        const event = await EventSchema.findById(eventId).populate({
            path: "attendedVolunteers",
            select: VOL_FIELDS,
            options: {
                sort: { name: 1 },
                skip: numberAttendedMixed + page * VOLS_PER_PAGE - (numberAttendedMixed + totalRegistered),
                limit: VOLS_PER_PAGE,
            },
        });

        volunteers = event!.attendedVolunteers as Volunteer[];
        numberRegistered = 0;
    }
    */

    // return vols array and registered count
    const ret: PaginatedVolunteers = {
        volunteers: volunteers,
        registeredCount: numberRegistered,
    };
    return ret;
};
