import mongoDB from "../index";
import EventSchema from "../models/Event";
import { Event, APIError, Volunteer } from "utils/types";

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
    const VOLS_PER_PAGE = 6;

    // 1. get size of registeredVolunteers

    // 2. determine what to fill the return array with:
    // if size >= (page+1) * VOLS_PER_PAGE
    //   all registered
    // else if size > page * VOLS_PER_PAGE
    //   // numberRegistered = VOLS_PER_PAGE * (page+1) - size
    //   numberAttended = size % VOLS_PER_PAGE
    //   numberRegistered = VOLS_PER_PAGE - numberAttended
    //   mixed
    // else
    //   skip: size % VOLS_PER_PAGE (mixed) + pages in for attended * VOLS_PER_PAGE
    //   all attended

    // 3. return vols array + registered count

    const event = await EventSchema.findById(eventId).populate({
        path: "registeredVolunteers",
        select: "_id name email phone",
        options: {
            sort: { name: 1 },
            skip: page * VOLS_PER_PAGE,
            limit: VOLS_PER_PAGE,
        },
    });

    const volunteers = event?.registeredVolunteers as Volunteer[];

    return volunteers;
};
