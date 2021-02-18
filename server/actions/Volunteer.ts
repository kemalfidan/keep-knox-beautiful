import mongoDB from "../index";
import VolunteerSchema from "../models/Volunteer";
import { Volunteer } from "utils/types";

export async function getAlteredUsername(username: string): Promise<string> {
    if (!username) throw new Error("Invalid username");
    return username + "123";
}

/** GET VOLUNTEER
 * @param id VolunteerId to identify a volunteer in our database.
 * @returns A single volunteer.
 * To-Do: Implementation
 */

/** ADD VOLUNTEER
 * @param user The user to insert into our database.
 */
export const addVolunteer = async function (vol: Volunteer) {
    await mongoDB();
    if (!vol) {
        throw new Error("Invalid volunteer");
    }

    await VolunteerSchema.create(vol);
};
