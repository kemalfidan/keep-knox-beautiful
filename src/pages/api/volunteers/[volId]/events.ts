import { NextApiRequest, NextApiResponse } from "next";
import { getVolunteerEvents } from "server/actions/Volunteer";
import errors from "utils/errors";
import { Event, APIError } from "utils/types";

// @route   /api/volunteers/[volId]/events - Returns a list of paginated
// events that a single volunteer attended
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method == "GET") {
            if (!req || !req.query || !req.query.volId || !req.query.page) {
                throw new Error("Need a volunteer id and a page number for this route.");
            }
            const volId = req.query.volId as string;
            const page = Number(req.query.page);

            const events: Event[] = await getVolunteerEvents(volId, page);
            res.status(200).json({
                success: true,
                payload: events,
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
