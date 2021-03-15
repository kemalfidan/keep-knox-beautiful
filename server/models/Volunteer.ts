import { model, models, Model, Schema, Document } from "mongoose";
import { Volunteer } from "utils/types";

export const VolunteerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    // filledForm: {
    //     type: Boolean,
    //     required: true,
    // },
    attendedEvents: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
        required: false,
        default: [],
    },
    registeredEvents: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
        required: false,
        default: [],
    },
});

export interface VolunteerDocument extends Omit<Volunteer, "_id"|"totalEvents"|"totalHours">, Document {}

export default (models.Volunteer as Model<VolunteerDocument>) || model<VolunteerDocument>("Volunteer", VolunteerSchema);
