import { NextApiRequest, NextApiResponse } from "next";
import { getVolunteerEvents } from "server/actions/Volunteer";
import errors from "utils/errors";
import { LoadMorePaginatedData, APIError } from "utils/types";
import authenticate from "server/actions/Authenticate";

// @route   /api/volunteers/[volId]/events - Returns a list of paginated
//   events that a single volunteer attended by the LoadMorePaginatedData type. - Private.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method == "GET") {
            authenticate(req, res);
            if (!req || !req.query || !req.query.volId || !req.query.page) {
                throw new Error("Need a volunteer id and a page number for this route.");
            }
            const volId = req.query.volId as string;
            const page = Number(req.query.page);

            const events: LoadMorePaginatedData = await getVolunteerEvents(volId, page);
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
