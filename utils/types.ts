// Keep these in sync with the backend schema

export interface Volunteer {
    _id?: string;
    email?: string;
    name: string;
    phone?: string;
    filledForm?: boolean;
    attendedEvents?: Array<Event>;
    signedUpEvents?: Array<Event>;
}

export interface Event {
    _id?: string;
    name: string;
    description?: string;
    date?: Date;
    startTime?: Date;
    endTime?: Date;
    location?: string;
    startRegistration?: Date;
    endRegistration?: Date;
    hours: number;
    image?: ContentfulImage;
    registeredAttendees?: Array<string>;
    presentAttendees?: Array<string>;
    absentAttendees?: Array<string>;
}

export interface ContentfulImage {
    assetID: string;
    url: string;
}
