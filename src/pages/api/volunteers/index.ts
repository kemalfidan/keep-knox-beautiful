<<<<<<< HEAD
import { NextApiRequest, NextApiResponse } from "next";
import errors from "utils/errors";
import formidable from "formidable";
import { Volunteer } from "utils/types";
import { addVolunteer } from "server/actions/Volunteer";

// formidable config
export const config = {
    api: {
        bodyParser: false,
    },
};

// POST /api/volunteers will create a single volunteer in the system
//    ...(may not be needed since we'll auto-create one when they sign up for an event)
// GET /api/volunteers will return a paginated list of all volunteers
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            throw new Error("Not implemented yet");
        } else if (req.method === "POST") {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err: string, fields: formidable.Fields, files: formidable.Files) => {
                const vol: Volunteer = (fields as unknown) as Volunteer;
                console.log("volunteerInfo: ", vol);
                await addVolunteer(vol);
                res.status(200).json({
                    success: true,
                    payload: {},
                });
            });
        }
    } catch (error) {
        console.error(error instanceof Error && error);
        res.status(400).json({
            success: false,
            message: (error instanceof Error && error.message) || errors.GENERIC_ERROR,
        });
    }
}
=======
export {};
// POST /api/volunteers will create a single volunteer in the system
//    ...(may not be needed since we'll auto-create one when they sign up for an event)
// GET /api/volunteers will return a paginated list of all volunteers
>>>>>>> b0db44f (Added api and page routes, updated constants, plus some other fixes)
