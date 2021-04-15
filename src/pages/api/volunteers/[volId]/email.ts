import { NextApiRequest, NextApiResponse } from "next";
import { sendVerificationEmail } from "server/actions/Volunteer";
import errors from "utils/errors";
import { Volunteer, APIError } from "utils/types";

// @route   PUT /api/volunteers/[volId]/email - Emails a single volunteer
//   their attendance information. - Private
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {
            if (!req || !req.query || !req.query.volId) {
                throw new Error("Need a volunteer id for this route.");
            }

            const id = req.query.volId as string;
            await sendVerificationEmail(id);
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
