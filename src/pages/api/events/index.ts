import { NextApiRequest, NextApiResponse } from "next";
import errors from "utils/errors";
import { Event } from "utils/types";

// @route   GET /api/events - Return a list of paginated events. - Public
// @route   POST /api/events - Create an event from form data. - Private
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
        }
        else if (req.method === "POST") {
        }   
    } catch (error) {
        console.error(error instanceof Error && error);
        res.status(400).json({
            success: false,
            message: (error instanceof Error && error.message) || errors.GENERIC_ERROR,
        });
    }
}
