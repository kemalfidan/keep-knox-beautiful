import mongoDB from "../index";
import VolunteerSchema from "../models/Volunteer";
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
 * @param user The user to insert into our database.
 */
export const addVolunteer = async function (vol: Volunteer) {
    await mongoDB();
    if (!vol) {
        throw new APIError(400, "Invalid volunteer");
    }

    await VolunteerSchema.create(vol);
};
