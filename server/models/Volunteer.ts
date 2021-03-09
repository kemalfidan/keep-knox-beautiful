import { model, models, Model, Schema, Document } from "mongoose";
import { Volunteer } from "utils/types";
import { EventSchema } from "server/models/Event";

export const VolunteerSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    filledForm: {
        type: Boolean,
        required: true,
    },
    attendedEvents: {
        type: [EventSchema],
        required: false,
    },
    signedUpEvents: {
        type: [EventSchema],
        required: false,
    },
});

export interface VolunteerDocument extends Omit<Volunteer, "_id">, Document {}

export default (models.Volunteer as Model<VolunteerDocument>) || model<VolunteerDocument>("Volunteer", VolunteerSchema);
