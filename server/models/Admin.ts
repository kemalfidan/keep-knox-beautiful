import { model, models, Model, Schema, Document } from "mongoose";
import { Admin } from "utils/types";

export const AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export interface AdminDocument extends Omit<Admin, "_id">, Document {}

export default (models.Admin as Model<AdminDocument>) || model<AdminDocument>("Admin", AdminSchema);
