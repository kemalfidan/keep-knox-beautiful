import { NextApiRequest, NextApiResponse } from "next";
import errors from "utils/errors";
import formidable from "formidable";
import { Volunteer, APIError } from "utils/types";
import { addVolunteer, getVolunteers } from "server/actions/Volunteer";

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
            const page: number = parseInt(req.query?.page as string);
            const search = req.query?.search as string;
            const volunteers: Volunteer[] = await getVolunteers(page, search);

            res.status(200).json({
                success: true,
                payload: { volunteers },
            });
        } else if (req.method === "POST") {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err: string, fields: formidable.Fields, files: formidable.Files) => {
                try {
                    const vol: Volunteer = (fields as unknown) as Volunteer;
                    console.log("volunteerInfo: ", vol);
                    await addVolunteer(vol);
                    res.status(200).json({
                        success: true,
                        payload: {},
                    });
                } catch (error) {
                    if (error instanceof APIError) {
                        res.status(error.statusCode).json({
                            success: false,
                            message: error.message,
                        });
                    } else {
                        console.error(error instanceof Error && error);
                        res.status(500).json({
                            success: false,
                            message: (error instanceof Error && error.message) || errors.GENERIC_ERROR,
                        });
                    }
                }
            });
        }
    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        } else {
            console.error(error instanceof Error && error);
            res.status(500).json({
                success: false,
                message: (error instanceof Error && error.message) || errors.GENERIC_ERROR,
            });
        }
    }
}
