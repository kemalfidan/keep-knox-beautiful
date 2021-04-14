import { NextApiRequest, NextApiResponse } from "next";
import errors from "utils/errors";
import { Admin, APIError } from "utils/types";
import { verify } from "jsonwebtoken";

// @route   POST /api/admin/validateLogin - Returns 200 status code if user is an admin.
//   It does so by verifying the auth cookie in the header. - Public
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const secret = process.env.JWTSECRET as string;
            verify(req.cookies.auth, secret, function (error, decoded: any) {
                if (!error && decoded) {
                    const decodedMessage = decoded as Admin;

                    res.status(200).json({
                        success: true,
                        payload: decodedMessage,
                    });
                } else {
                    throw new APIError(401, "Not authenticated.");
                }
            });
        }
    } catch (error) {
        res.setHeader("Set-Cookie", "auth=; Max-Age=0; SameSite=Lax; Path=/");
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
