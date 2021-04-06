import { NextApiRequest, NextApiResponse } from "next";
import errors from "utils/errors";
import { Event, Volunteer, APIError } from "utils/types";
import { registerVolunteerToEvent } from "server/actions/Volunteer";

// POST /api/events/[eventId]/signup will take form data and sign up a new or existing
//   volunteer for event eventId. Also takes optional query param for `count` only
//   for group events
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            /* eslint @typescript-eslint/no-unsafe-assignment: "off" */
            const eventId = req.query.eventId as string;
            const vol: Volunteer = JSON.parse(req.body);

            // default count to 1
            const count = req.query.count ? Number(req.query.count) : 1;

            await registerVolunteerToEvent(vol, eventId, count);
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
