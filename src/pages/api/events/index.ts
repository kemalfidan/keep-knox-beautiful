import { NextApiRequest, NextApiResponse } from "next";
import errors from "utils/errors";
import formidable, { File } from "formidable";
import { Event, APIError } from "utils/types";
import constants from "utils/constants";
import { addEvent, getCurrentEvents, getPastEventsAdmin } from "server/actions/Event";
import { uploadImage } from "server/actions/Contentful";

// formidable config
export const config = {
    api: {
        bodyParser: false,
    },
};

// @route   GET /api/events - Return a list of events events. Use `type` param to declare
//   what type of events to return. - Public
// @route   POST /api/events - Create an event from form data. - Private
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const type = req.query.type;
            const page = req.query.page ? Number(req.query.page) : 1;
            const search = req.query.search ? new Date(req.query.search as string) : undefined;
            let events: Event[] = [];

            console.log("req.query.search:", req.query.search);
            console.log("search:", search);

            if (type == "current") {
                // shouldn't use this API route in prod since the events are pre-fetched
                //   with getServerSideProps and displayed statically on page
                events = await getCurrentEvents();
            } else if (type == "past") {
                // will be used since we paginate admin's page events
                events = await getPastEventsAdmin(page, search);
            } else {
                throw new APIError(400, "Invalid query parameter `type`.");
            }

            res.status(200).json({
                success: true,
                payload: { events },
            });
        } else if (req.method === "POST") {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err: string, fields: formidable.Fields, files: formidable.Files) => {
                try {
                    // fields includes everything but files
                    const event: Event = (fields as unknown) as Event;
                    const file: File = files?.image as File;

                    // fields are strings so convert the numbers
                    event.hours = Number(event?.hours);
                    event.maxVolunteers = Number(event?.maxVolunteers);

                    if (file) {
                        if (file?.size > constants.contentfulImageLimit) {
                            throw new APIError(400, "Image too large.");
                        }

                        event.image = await uploadImage(file);
                    }

                    await addEvent(event);
                    res.status(200).json({
                        success: true,
                        payload: {},
                    });
                } catch (error) {
                    // dont know of a cleaner way to do this
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
