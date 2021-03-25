import mongoDB from "../index";
import EventSchema from "../models/Event";
import { Types } from "mongoose";
import { Event, APIError, Volunteer, PaginatedVolunteers } from "utils/types";

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
 * @param page
 */
export const getEventVolunteers = async function (eventId: string, page: number, search?: string) {
    await mongoDB();
    const VOLS_PER_PAGE = 2;
    const VOL_FIELDS = "_id name email phone";
    let volunteers: Volunteer[] = [];
    let numberRegistered = 0;

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

    // return vols array and registered count
    const ret: PaginatedVolunteers = {
        volunteers: volunteers,
        registeredCount: numberRegistered,
    };
    return ret;
};
