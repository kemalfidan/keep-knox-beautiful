import { model, models, Model, Schema, Document } from "mongoose";
import ContentfulImageSchema from "./ContentfulImageSchema";
import { Event } from "utils/types";

export const EventSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    start_time: {
        type: Date,
        required: true,
    },
    end_time: {
        type: Date,
        required: true,
    },
    start_registration: {
        type: Date,
        required: false,
    },
    end_registration: {
        type: Date,
        required: false,
    },
    location: {
        type: String,
        required: true,
    },
    hours: {
        type: String,
        required: true,
    },
    image: {
        type: ContentfulImageSchema,
        required: false,
    },
});

export interface EventDocument extends Omit<Event, "_id">, Document {};

export default (models.Event as Model<EventDocument>) || model<EventDocument>("Event", EventSchema);
