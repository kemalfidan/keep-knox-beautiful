import mongoDB from "../index";
import VolunteerSchema from "../models/Volunteer";
import EventSchema from "../models/Event";
import { Event, Volunteer, APIError } from "utils/types";
import { escapeRegExp } from "utils/util";
import { createTransport } from "nodemailer";
import constants from "utils/constants";
import { format, isAfter } from "date-fns";

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
    const VOLS_PER_PAGE = 6;

    // error check page and set it to be offset from 0 (1st page will return the 0th offset of data)
    if (isNaN(page) || page < 1) {
        throw new APIError(400, "Invalid page number.");
    }
    page -= 1;

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
 * Updates a volunteer that already exists in database.
 * @param id The _id of the volunteer we want to update.
 * @param vol The new volunteer object to insert into database.
 */
export const updateVolunteer = async function (id: string, vol: Volunteer) {
    await mongoDB();
    if (!id || !vol) {
        throw new APIError(400, "Invalid previous volunteer or invalid new volunteer.");
    }

    const model = await VolunteerSchema.findByIdAndUpdate(id, vol);
    if (!model) {
        throw new APIError(404, "Volunteer not found.");
    }
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
 * @param registerCount The number of people registering for event eventId. Only allowed for group events.
 */
export const registerVolunteerToEvent = async function (vol: Volunteer, eventId: string, registerCount = 1) {
    await mongoDB();
    if (!vol || !eventId) {
        throw new APIError(400, "Invalid input. Need both volunteer and event information.");
    } else if (isNaN(registerCount) || registerCount < 1) {
        throw new APIError(400, "Invalid registration count.");
    }

    const event = await EventSchema.findById(eventId);
    if (!event) {
        throw new APIError(404, "Event does not exist.");
    } else if (event.maxVolunteers && event.volunteerCount! >= event.maxVolunteers) {
        throw new APIError(404, "Event is at max volunteers.");
    } else if (event.maxVolunteers && event.volunteerCount! + registerCount > event.maxVolunteers) {
        throw new APIError(404, "Count is greater than the number of volunteer spots remaining.");
    } else if (isAfter(Date.now(), event.endRegistration as Date)) {
        throw new APIError(404, "Registration for this event has closed.");
    } else if (!event.groupSignUp && registerCount > 1) {
        throw new APIError(404, "Group registration is not allowed for this event.");
    }

    // if !exists, create volunteer. Note that this might update the
    // info on a volunteer if other data other than email is different
    // VolunteerSchema.
    const volunteer = await VolunteerSchema.findOneAndUpdate({ email: vol.email }, vol, { new: true, upsert: true });
    if (event.registeredVolunteers?.indexOf(volunteer._id) !== -1) {
        throw new APIError(404, "You have already been registered to this event.");
    }

    volunteer.registeredEvents?.push(eventId);
    event.registeredVolunteers?.push(volunteer._id);
    event.volunteerCount! += registerCount; // default to 0 so will never be undefined
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

/**
 * This function returns a subset of a single volunteer's events.
 * @param volId The id of the volunteer whose events will be fetched.
 * @param page Since this data is paginated, page is used to return a certain subset of the data.
 */
export const getVolunteerEvents = async function (volId: string, page: number) {
    await mongoDB();
    const EVENTS_PER_PAGE = 3;
    const EVENT_FIELDS = { _id: 1, name: 1, startDate: 1, hours: 1 };

    if (!volId) {
        throw new APIError(400, "Invalid volunteer id.");
    }

    // error check page and set it to be offset from 0 (1st page will return the 0th offset of data)
    if (isNaN(page) || page < 1) {
        throw new APIError(400, "Invalid page number.");
    }
    page -= 1;

    const volunteer = (await VolunteerSchema.findById(volId).populate({
        path: "attendedEvents",
        select: EVENT_FIELDS,
        options: {
            sort: { startDate: -1, name: 1 },
            skip: page * EVENTS_PER_PAGE,
            limit: EVENTS_PER_PAGE,
        },
    })) as Volunteer;

    if (!volunteer) {
        throw new APIError(404, "Volunteer not found.");
    }
    return (volunteer.attendedEvents as unknown) as Event[];
};

/*
 * Sends an email to the volunteer. The email contains
 * 1. how many total hours the volunteer volunteered for
 * 2. how many events the volunteer volunteered at
 * 3. which events the volunteer attended
 * 4. the start date of the event
 * 5. how many hours each event was that the volunteer attended
 * @param volId The volunteer id of the volunteer that the email should be sent to
 */
export const sendVerificationEmail = async function (volId: string) {
    if (!volId) {
        throw new APIError(400, "Invalid id.");
    }

    const EVENT_FIELDS = { name: 1, hours: 1, startDate: 1 };
    const volunteer = await VolunteerSchema.findById(volId)
        .populate({
            path: "attendedEvents",
            select: EVENT_FIELDS,
            options: {
                sort: { startDate: 1, name: 1 },
            },
        })
        .lean();

    if (!volunteer) {
        throw new APIError(404, "Volunteer not found.");
    }

    const body = await createEmailBody(volunteer);
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: volunteer.email,
        subject: `${constants.org.name.full} Volunteer Verification`,
        text: body,
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Internally used function that returns the email body that contains a volunteer's
 * attended event information.
 * @param volunteer The populated volunteer object whose data will be used to
 * constuct the email.
 */
export const createEmailBody = async function (volunteer: Volunteer) {
    if (!volunteer.attendedEvents) {
        return "";
    }

    // create the section that contains which events the volunteer attended
    const eventArray: string[] = [];
    for (let i = 0; i < volunteer.attendedEvents.length; i++) {
        const event = volunteer.attendedEvents[i] as Event;
        const formattedDate = event.startDate ? format(event.startDate, "MMMM dd, yyyy") : "Unknown date";

        eventArray.push(`       ${event.name} - ${formattedDate} - ${event.hours || 0} hours`);
    }
    const eventsText = eventArray.join("\n");

    // return the entire email body
    return `${volunteer.name},

        Thank you for helping Keep Knoxville Beautiful for a total of ${volunteer.totalHours || 0} hours \
        across ${volunteer.totalEvents || 0} events! We seriously thank you for your excellent service to the community.

        The following is a list of events you volunteered at:
        ${eventsText}

        Keep Knoxville Beautiful is a 501(c)(3) nonprofit organization with a mission to inspire and empower Knox County \
        communities to improve their quality of life through beautification and environmental stewardship. For more \
        information on our organization, please visit keepknoxvillebeautiful.org. If you have any questions or concerns, \
        please contact me at alanna@keepknoxvillebeautiful.org or 865-521-6957. Thank you.
        
        Sincerely,

        Alanna McKissack
        Executive Director
    `.replace(/ {8}/g, "");
};
