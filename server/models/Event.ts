import { model, models, Schema } from "mongoose";
// import ContentfulImageSchema from "./ContentfulImage";

export const EventSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    // picture: {
    //     type: ContentfulImageSchema,
    //     required: false,
    // }
});

export default models?.Event ?? model("Event", EventSchema);
