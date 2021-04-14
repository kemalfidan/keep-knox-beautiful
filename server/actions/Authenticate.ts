import { Admin } from "utils/types";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";

// authenticate is what we attach to our API endpoints to make sure that people have the proper permissions to use them.
const authenticate = (func: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const secret = process.env.JWTSECRET as string;
    return verify(req.cookies.auth!, secret, async function (error, decoded: any) {
        if (!error && decoded) {
            const decodedMessage = decoded as Admin;
            return await func(req, res);
        } else {
            res.setHeader("Set-Cookie", "auth=; Max-Age=0; SameSite=Lax; Path=/");
            res.status(401).json({
                success: false,
                message: "Not authenticated.",
            });    
        }
    });
};

export default authenticate;
