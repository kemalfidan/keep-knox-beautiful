import { Admin, APIError } from "utils/types";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { verify } from "jsonwebtoken";

// authenticate is what our API endpoints use to make sure that people have the proper permissions to use them.
const authenticate = (req: NextApiRequest, res: NextApiResponse) => {
    const secret = process.env.JWTSECRET as string;
    if (!req.cookies.auth) {
        throw new APIError(401, "Not authenticated.");
    }

    const decoded = verify(req.cookies.auth, secret) as Admin;
    if (!decoded || !decoded.email) {
        throw new APIError(401, "Not authenticated.");
    }
};

export default authenticate;
