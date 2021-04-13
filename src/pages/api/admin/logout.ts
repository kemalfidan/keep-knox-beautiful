import { NextApiRequest, NextApiResponse } from "next";
import errors from "utils/errors";
import { APIError } from "utils/types";

// @route   POST /api/admin/logout - Logout a user by overriding cookie. - Private
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {
            res.setHeader("Set-Cookie", "auth=; Max-Age=0; SameSite=Lax; Path=/");

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
