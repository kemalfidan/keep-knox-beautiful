import { NextApiRequest, NextApiResponse } from "next";
import { Admin, APIError } from "utils/types";
import { login } from "server/actions/Admin";
import cookie from "cookie";
import errors from "utils/errors";

// @route   POST /api/admin/login - Log user in by returning
//   a cookie with jwt string in the header. - Public
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const currentAdmin = req.body as Admin;
            const jwt = await login(currentAdmin);

            // cookie lives for 1 week
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("auth", jwt, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: 604800,
                    path: "/",
                })
            );
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
