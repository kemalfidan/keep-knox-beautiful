import { NextApiRequest, NextApiResponse } from "next";
import { getEvent } from "server/actions/Event";
import errors from "utils/errors";
import { Event } from "utils/types";
import EventSchema from "../../../../server/models/Event";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id: string = req.body as string;
        var event: Event = await getEvent(id);
        res.status(200).json({
            success: true,
            payload: {},
        });
    } catch (error) {
        console.error(error instanceof Error && error);
        res.status(400).json({
            success: false,
            message: (error instanceof Error && error.message) || errors.GENERIC_ERROR,
        });
    }
};
