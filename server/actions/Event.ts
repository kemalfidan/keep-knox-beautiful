import mongoDB from "../index";
import EventSchema from "../models/Event";
import { Event } from "utils/types";

/**
 * @param id EventId string to identify an event in our database.
 * @returns A single event.
 */
export const getEvent = async function (id: string) {
    await mongoDB();
    if (!id || id == "") {
        throw new Error("Invalid id");
    }

    const event = (await EventSchema.findById(id)) as Event;
    if (event == null) {
        throw new Error("Event does not exist");
    }

    return event;
};

/**
 * @returns All events.
 */
export const getEvents = async function () {
    await mongoDB();

    const events = (await EventSchema.find({})) as Array<Event>;
    if (!!events && !events.length) {
        throw new Error("No events");
    }

    return events;
};

/**
 * @param event The event to insert into our database.
 */
export const addEvent = async function (event: Event) {
    await mongoDB();
    if (!event) {
        throw new Error("Invalid event");
    }

    await EventSchema.create(event);
};

/**
 * @param id EventId of event that will be deleted
 */
export const deleteEvent = async function (id: string) {
    await mongoDB();
    if (!id || id == "") {
        throw new Error("Invalid id");
    }

    await EventSchema.findByIdAndDelete(id);
};
