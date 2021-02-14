import { NextApiRequest, NextApiResponse } from "next";

// empty for now, check my other branch kemalfidan/create-api-routes for more api routes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        res.status(200).json({
            success: false,
            payload: {},
        });
    } catch (error) {
        console.error(error instanceof Error && error);
        res.status(400).json({
            success: false,
            message: {},
        });
    }
}
