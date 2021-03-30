import mongoDB from "../index";
import VolunteerSchema from "../models/Volunteer";
import EventSchema from "../models/Event";
import { Volunteer, APIError } from "utils/types";
import { escapeRegExp } from "utils/util";

// only return these fields from mongodb
const VOL_FIELDS = {
    name: 1,
    email: 1,
    _id: 1,
};

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
 * @param page Since this data is paginated, page is used to return a certain subset of the data.
 * @param search Optional parameter used to search volunteers by name.
 * @returns A limited number of volunteers in an array.
 */
export const getVolunteers = async function (page: number, search = "") {
    await mongoDB();
    if (isNaN(page) || page < 0) {
        throw new APIError(400, "Invalid page number.");
    }
    const VOLS_PER_PAGE = 6;

    // optional search, ignores case
    const vols = await VolunteerSchema.find(
        { name: { $regex: `.*${escapeRegExp(search)}.*`, $options: "i" } },
        VOL_FIELDS
    )
        .sort({ name: 1 })
        .skip(page * VOLS_PER_PAGE)
        .limit(VOLS_PER_PAGE);

    // 0 vols found is a valid state and not an error
    // since search might return none
    return vols;
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
 * @param ids An array of volunteer objectIds whose hours need to be updated.
 * @param change The change that needs to be applied to each volunteer's hours. Can be negative.
 */
export const updateVolunteerHours = async function (ids: string[], change: number) {
    await mongoDB();

    await VolunteerSchema.updateMany({ _id: { $in: ids } }, { $inc: { totalHours: change } });
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
    if (event.maxVolunteers && event.volunteerCount! >= event.maxVolunteers) {
        throw new APIError(404, "Event is at max volunteers.");
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

/**
 * Marks a volunteer present at an event. Also adds the event to a volunteer's attended events list.
 * @param volId The volunteer id of the volunteer to mark present
 * @param eventId the event id the volunteer attended
 */
export const markVolunteerPresent = async function (volId: string, eventId: string) {
    await mongoDB();
    if (!volId || !eventId) {
        throw new APIError(400, "Invalid input. Need both volunteer and event information.");
    }

    const event = await EventSchema.findById(eventId);
    if (!event) {
        throw new APIError(404, "Event does not exist.");
    }

    const volunteer = await VolunteerSchema.findById(volId);
    if (!volunteer) {
        throw new APIError(404, "Volunteer does not exist.");
    }

    if (
        volunteer.attendedEvents?.indexOf(event?._id) !== -1 ||
        event.attendedVolunteers?.indexOf(volunteer?._id) !== -1
    ) {
        throw new APIError(500, "The volunteer has already been checked in to this event.");
    }

    if (
        volunteer.registeredEvents?.indexOf(event?._id) === -1 ||
        event.registeredVolunteers?.indexOf(volunteer?._id) === -1
    ) {
        throw new APIError(500, "The volunteer is not registered for this event.");
    }

    const volPromise = VolunteerSchema.findByIdAndUpdate(volId, {
        $push: { attendedEvents: eventId },
        $pull: { registeredEvents: eventId },
        $inc: { totalHours: event.hours!, totalEvents: 1 },
    });

    const eventPromise = EventSchema.findByIdAndUpdate(eventId, {
        $push: { attendedVolunteers: volId },
        $pull: { registeredVolunteers: volId },
    });

    await Promise.all([volPromise, eventPromise]);
};

/**
 * Un-marks volunteer as present at an event. Does the same to the volunteer's attended events list.
 * @param volId The volunteer id of the volunteer to un-mark present
 * @param eventId the event id the volunteer is registered for
 */
export const markVolunteerNotPresent = async function (volId: string, eventId: string) {
    await mongoDB();
    if (!volId || !eventId) {
        throw new APIError(400, "Invalid input. Need both volunteer and event information.");
    }

    const event = await EventSchema.findById(eventId);
    if (!event) {
        throw new APIError(404, "Event does not exist.");
    }

    const volunteer = await VolunteerSchema.findById(volId);
    if (!volunteer) {
        throw new APIError(404, "Volunteer does not exist.");
    }

    if (
        volunteer.attendedEvents?.indexOf(event?._id) === -1 ||
        volunteer?.registeredEvents?.indexOf(event?._id) !== -1
    ) {
        throw new APIError(500, "The volunteer is not checked in to this event.");
    }

    if (
        event.attendedVolunteers?.indexOf(volunteer?._id) === -1 ||
        event?.registeredVolunteers?.indexOf(volunteer?._id) !== -1
    ) {
        throw new APIError(500, "The volunteer is not checked in to this event.");
    }

    const volPromise = VolunteerSchema.findByIdAndUpdate(volId, {
        $push: { registeredEvents: eventId },
        $pull: { attendedEvents: eventId },
        $inc: { totalHours: -1 * event.hours!, totalEvents: -1 },
    });

    const eventPromise = EventSchema.findByIdAndUpdate(eventId, {
        $push: { registeredVolunteers: volId },
        $pull: { attendedVolunteers: volId },
    });

    await Promise.all([volPromise, eventPromise]);
};
