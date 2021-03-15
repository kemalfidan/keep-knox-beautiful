import mongoDB from "../index";
import VolunteerSchema from "../models/Volunteer";
import EventSchema from "../models/Event";
import { Volunteer, APIError } from "utils/types";

/**
 * @param id VolunteerId to identify a volunteer in our database.
 * @returns A single volunteer.
 */
export const getVolunteer = async function (id: string) {
    await mongoDB();
    if (!id || id == "") {
        throw new APIError(400, "Invalid id");
    }

    const vol = (await VolunteerSchema.findById(id)) as Volunteer;
    if (!vol) {
        throw new APIError(404, "Volunteer does not exist");
    }

    return vol;
};

/**
 * @param vol The volunteer to insert into our database.
 */
export const addVolunteer = async function (vol: Volunteer) {
    await mongoDB();
    if (!vol) {
        throw new APIError(400, "Invalid volunteer");
    }

    await VolunteerSchema.create(vol);
};

/**
 * Registers a volunteer to an event. Also adds the event to a volunteer's registered
 * events list. If the volunteer does not exist, it will create one first.
 * @param vol The volunteer data to register.
 * @param eventId The event id to register the volunter for.
 */
export const registerVolunteerToEvent = async function (vol: Volunteer, eventId: string) {
    await mongoDB();
    if (!vol || !eventId) {
        throw new APIError(400, "Invalid input. Need both volunteer and event information.");
    }

    const event = await EventSchema.findById(eventId);
    if (!event) {
        throw new APIError(404, "Event does not exist.");
    }

    // if !exists, create volunteer. Note that this might update the
    // info on a volunteer if other data other than email is different
    // VolunteerSchema.
    const volunteer = await VolunteerSchema.findOneAndUpdate({ email: vol.email }, vol, { new: true, upsert: true });
    if (event.registeredVolunteers?.indexOf(volunteer._id) !== -1) {
        throw new APIError(404, "The volunteer has already been registered to this event.");
    }

    volunteer.registeredEvents?.push(eventId);
    event.registeredVolunteers?.push(volunteer._id);
    event.volunteerCount! += 1; // default to 0 so will never be undefined
    // these are not atomic updates
    const volPromise = VolunteerSchema.updateOne({ email: vol.email }, volunteer);
    const eventPromise = EventSchema.updateOne({ _id: eventId }, event);
    await Promise.all([volPromise, eventPromise]);
};
