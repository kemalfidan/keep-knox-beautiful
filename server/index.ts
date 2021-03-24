import mongoose from "mongoose";
import urls from "utils/urls";

// load the models before we start using them or else they wont
// be defined and we get a MissingSchemaError
require("./models/Volunteer");
require("./models/Event");

export default async () => {
    if (mongoose.connections[0].readyState) return;
    const DB_URL: string = urls.dbUrl;

    await mongoose
        .connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        .catch((error: any) => {
            console.error("Database connection failed.");
            console.error(error instanceof Error && error);
            throw error;
        });
};
