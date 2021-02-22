import { NextApiRequest, NextApiResponse } from "next";
import { getEvent } from "server/actions/Event";
import errors from "utils/errors";
import { Event } from "utils/types";

// GET /api/events/[eventId] will return info for event eventId - Public
// DELETE /api/events/[eventId] will delete event eventId - Private
// POST /api/events/[eventId] will update event eventId with form data - Private

// @route   GET /api/events/[eventId] - Returns a single Event object for event eventId. - Public
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req || !req.query || !req.query.eventId) {
            throw new Error("Need an event id for this route.");
        }

        const id = req.query.eventId as string;
        const event: Event = await getEvent(id);
        res.status(200).json({
            success: true,
            payload: event,
        });
    } catch (error) {
        console.error(error instanceof Error && error);
        res.status(400).json({
            success: false,
            message: (error instanceof Error && error.message) || errors.GENERIC_ERROR,
        });
    }
}
