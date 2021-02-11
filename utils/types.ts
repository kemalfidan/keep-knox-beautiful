import { ObjectID } from "mongodb";

export interface Event {
    _id?: ObjectID;
    name?: string;
    description?: string;
    date: Date;
    start_time: Date;
    end_time: Date;
    location: string;
    start_registration: Date;
    end_registration: Date;
    hours: number;
    image: string;
    registered_attendees: Array<string>;
    present_attendees: Array<string>;
    absent_attendees: Array<string>;
}
