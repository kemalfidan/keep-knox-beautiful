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
        required: false,
    },
    caption: {
        type: String,
        required: false,
    },
    maxVolunteers: {
        type: Number,
        required: false,
    },
    startDate: {
        type: Date,
        required: false,
    },
    endDate: {
        type: Date,
        required: false,
    },
    startRegistration: {
        type: Date,
        required: false,
    },
    endRegistration: {
        type: Date,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    hours: {
        type: String,
        required: false,
    },
    image: {
        type: ContentfulImageSchema,
        required: false,
    },
});

export interface EventDocument extends Omit<Event, "_id">, Document {}

export default (models.Event as Model<EventDocument>) || model<EventDocument>("Event", EventSchema);
