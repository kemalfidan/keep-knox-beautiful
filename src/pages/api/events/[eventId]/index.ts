import { NextApiRequest, NextApiResponse } from "next";
import { updateVolunteerHours } from "server/actions/Volunteer";
import { getEvent, deleteEvent, updateEvent } from "server/actions/Event";
import errors from "utils/errors";
import { Event, APIError } from "utils/types";
import constants from "utils/constants";
import formidable, { File } from "formidable";
import { deleteAssetByID, uploadImage } from "server/actions/Contentful";

// formidable config
export const config = {
    api: {
        bodyParser: false,
    },
};

// @route   GET /api/event/[eventId] - Returns a single Event object for event eventId. - Public
// @route   DELETE /api/event/[eventId] - Deletes single Event object event eventId. - Private
// @route   POST /api/event/[eventId] - Updates the existing Event object with _id of eventId with the new event. - Private
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req || !req.query || !req.query.eventId) {
            throw new Error("Need an event id for this route.");
        }
        const id = req.query.eventId as string;

        if (req.method === "GET") {
            const event: Event = await getEvent(id);
            res.status(200).json({
                success: true,
                payload: event,
            });
        } else if (req.method === "DELETE") {
            await deleteEvent(id);
            res.status(200).json({
                success: true,
            });
        } else if (req.method === "POST") {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err: string, fields: formidable.Fields, files: formidable.Files) => {
                try {
                    // fields includes everything but files
                    const newEvent: Event = (fields as unknown) as Event;
                    const file: File = files?.image as File;

                    // fields are strings so convert the numbers
                    newEvent.hours = Number(newEvent?.hours);
                    newEvent.maxVolunteers = Number(newEvent?.maxVolunteers);

                    const existingEvent = await getEvent(id);

                    // see if user is providing an image for the new event. if so, the old one must be
                    // removed. to do this, look at the existing event and delete the image if it exists.
                    // the image is removed and reuploaded even if it's the same content.
                    if (file) {
                        if (file.size > constants.contentfulImageLimit) {
                            throw new APIError(400, "Image too large.");
                        }

                        if (existingEvent.image?.assetID) {
                            await deleteAssetByID(existingEvent.image.assetID);
                        }
                        newEvent.image = await uploadImage(files.image as File);
                    }

                    // if event hours are being changed, each volunteer's hours that has been
                    // marked present for that event must also be updated. this was done since
                    // aggregating total hours worked for every view of a volunteer profile's
                    // would be slow and we anticipated event updates would be done less frequently
                    // than profile views
                    if (
                        existingEvent.hours &&
                        existingEvent.hours !== newEvent.hours &&
                        existingEvent.attendedVolunteers &&
                        existingEvent.attendedVolunteers.length > 0
                    ) {
                        const change = newEvent.hours - existingEvent.hours;
                        await updateVolunteerHours(existingEvent.attendedVolunteers as string[], change);
                    }

                    await updateEvent(id, newEvent);
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
