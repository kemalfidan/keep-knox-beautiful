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

    const event: Event = await EventSchema.findById(id);
    if (event == null) {
        throw new Error("Event does not exist");
    }

    return event;
};
