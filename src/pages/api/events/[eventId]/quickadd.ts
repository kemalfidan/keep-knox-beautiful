import { NextApiRequest, NextApiResponse } from "next";
import { sudoRegisterVolunteerToEvent } from "server/actions/Volunteer";
import errors from "utils/errors";
import { Volunteer, APIError } from "utils/types";

// @route   POST /api/admin/signup - Create a new admin. - Private
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req || !req.query || !req.query.eventId) {
            throw new Error("Need an event id for this route.");
        }
        const id = req.query.eventId as string;

        if (req.method === "POST") {
            const newVol = JSON.parse(req.body) as Volunteer;
            await sudoRegisterVolunteerToEvent(newVol, id);

            res.status(200).json({
                success: true,
                payload: {},
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
