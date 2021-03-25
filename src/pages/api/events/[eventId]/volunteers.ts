import { NextApiRequest, NextApiResponse } from "next";
import { getEventVolunteers } from "server/actions/Event";
import errors from "utils/errors";
import { Event, APIError, PaginatedVolunteers } from "utils/types";

// @route   GET /api/events/[eventId]/volunteers - Returns a paginated list of volunteers for event eventId.
//   The return type always includes registered vols first (if any are needed for this page), then attended
//   vols. Also specifies the number of registered vols in the array (see PaginatedVolunteers type). - Private
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req || !req.query || !req.query.eventId || !req.query.page) {
            throw new Error("Need an event id and a page number for this route.");
        }
        const eventId = req.query.eventId as string;
        const page = Number(req.query.page);

        if (req.method == "GET") {
            const paginatedVols: PaginatedVolunteers = await getEventVolunteers(eventId, page);

            res.status(200).json({
                success: true,
                payload: paginatedVols,
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
