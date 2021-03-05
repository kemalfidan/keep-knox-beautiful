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
    caption: {
        type: String,
        required: true,
    },
    maxVolunteers: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    startRegistration: {
        type: Date,
        required: true,
    },
    endRegistration: {
        type: Date,
        required: true,
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
    registeredVolunteers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Volunteer' }],
        required: false,
    },
    presentVolunteers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Volunteer' }],
        required: false,
    },
});

export interface EventDocument extends Omit<Event, "_id">, Document {}

export default (models.Event as Model<EventDocument>) || model<EventDocument>("Event", EventSchema);
