import { NextApiRequest, NextApiResponse } from "next";
import errors from "utils/errors";
import { Admin, APIError } from "utils/types";
import { createAdmin } from "server/actions/Admin";

// @route   POST /api/admin/signup - Create a new admin. - Private
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const newAdmin = req.body as Admin;
            await createAdmin(newAdmin);

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
