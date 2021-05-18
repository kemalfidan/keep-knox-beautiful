import { NextApiRequest, NextApiResponse } from "next";
import { getVolunteer, updateVolunteer } from "server/actions/Volunteer";
import errors from "utils/errors";
import { Volunteer, APIError } from "utils/types";
import constants from "utils/constants";
import formidable from "formidable";
import authenticate from "server/actions/Authenticate";

// formidable config
export const config = {
    api: {
        bodyParser: false,
    },
};

// @route   GET /api/volunteers/[volId] - Returns a single Volunteer object for volunteer volId. - Private
// @route   POST /api/volunteers/[volId] - Updates existing Volunteer object with _id of volId. - Private
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req || !req.query || !req.query.volId) {
            throw new Error("Need a volunteer id for this route.");
        }

        const id = req.query.volId as string;

        if (req.method == "GET") {
            authenticate(req, res);
            const vol: Volunteer = await getVolunteer(id);
            res.status(200).json({
                success: true,
                payload: vol,
            });
        } else if (req.method == "POST") {
            authenticate(req, res);
            const form = new formidable.IncomingForm();
            form.parse(req, async (err: string, fields: formidable.Fields, files: formidable.Files) => {
                try {
                    const newVol: Volunteer = (fields as unknown) as Volunteer;

                    // only a volunteer's email, name, and phone are available to change via admin edit form
                    // these are all strings, so no need to convert any input - fields are strings

                    await updateVolunteer(id, newVol);
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
