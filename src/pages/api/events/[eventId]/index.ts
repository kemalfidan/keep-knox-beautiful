import { NextApiRequest, NextApiResponse } from "next";
import { getEvent, deleteEvent } from "server/actions/Event";
import errors from "utils/errors";
import { Event, APIError } from "utils/types";

// GET /api/events/[eventId] will return info for event eventId - Public
// DELETE /api/events/[eventId] will delete event eventId - Private
// POST /api/events/[eventId] will update event eventId with form data - Private

// @route   GET /api/event/[eventId] - Returns a single Event object for event eventId. - Public
// @route   DELETE /api/event/[eventId] - Deletes single Event object event eventId.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req || !req.query || !req.query.eventId) {
            throw new Error("Need an event id for this route.");
        }

        if (req.method == "GET") {
            const id = req.query.eventId as string;
            const event: Event = await getEvent(id);
            res.status(200).json({
                success: true,
                payload: event,
            });
        }

        if (req.method == "DELETE") {
            const id = req.query.eventId as string;
            await deleteEvent(id);
            res.status(200).json({
                success: true,
            });
        }
    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        else {
            console.error(error instanceof Error && error);
            res.status(500).json({
                success: false,
                message: (error instanceof Error && error.message) || errors.GENERIC_ERROR,
            });
        }
    }
}
