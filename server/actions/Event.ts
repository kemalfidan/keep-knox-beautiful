import mongoDB from "../index";
import EventSchema from "../models/Event";
import { Event } from "utils/types";

/**
 * @param id String to identify an event in our database.
 * @returns A single event.
 */
export const getEvent = async function (id: String) {
    await mongoDB();
    if (!id || id == "") {
        throw new Error("Invalid id");
    }

    const event: Event = await EventSchema.findOne({"_id": id}).exec();
    if (event == null) {
        throw new Error("Event does not exist");
    }

    return event;
};
