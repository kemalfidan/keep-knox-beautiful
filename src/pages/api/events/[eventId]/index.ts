import { NextApiRequest, NextApiResponse } from "next";
import { getEvent } from "server/actions/Event";
import errors from "utils/errors";
import { Event } from "utils/types";

// GET /api/events will return a list of (paginated) events
// POST /api/events will create an event

// @route   GET /api/events
// @desc    Return a list of paginated events.
// @access  Public
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
