import { NextApiRequest, NextApiResponse } from "next";
import { getVolunteer } from "server/actions/Volunteer";
import errors from "utils/errors";
import { Volunteer, APIError } from "utils/types";

// GET /api/volunteers/[volId] will return a single volunteer profile that matches the volId
// POST /api/volunteers/[volId] will take new form data and update basic account info

// @route   GET /api/volunteers/[volId] - Returns a single Volunteer object for volunteer volId.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req || !req.query || !req.query.volId) {
            throw new Error("Need a volunteer id for this route.");
        }

        const id = req.query.volId as string;
        const vol: Volunteer = await getVolunteer(id);
        res.status(200).json({
            success: true,
            payload: vol,
        });
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
