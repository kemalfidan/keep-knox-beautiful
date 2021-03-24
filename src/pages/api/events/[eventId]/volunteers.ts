import { NextApiRequest, NextApiResponse } from "next";
import { getEventVolunteers } from "server/actions/Event";
import errors from "utils/errors";
import { Event, APIError } from "utils/types";

// @route   GET /api/events/[eventId]/volunteers - Returns a paginated list of volunteers for event eventId. - Private
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req || !req.query || !req.query.eventId) {
            throw new Error("Need an event id for this route.");
        }

        if (req.method == "GET") {
            const eventId = req.query.eventId as string;
            const events: Event[] = await getEventVolunteers(eventId, 0);

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
