// Keep these in sync with the backend schema

export interface Volunteer {
    _id?: string;
    email?: string;
    name: string;
    phone?: string;
    filledForm?: boolean;
    totalEvents?: number;
    totalHours?: number;
    attendedEvents?: Array<Event>;
    signedUpEvents?: Array<Event>;
}

export interface Event {
    _id?: string;
    name: string;
    description?: string;
    caption?: string;
    maxVolunteers?: number;
    startDate?: Date;
    startTime?: Date;
    endDate?: Date;
    endTime?: Date;
    location?: string;
    startRegistration?: Date;
    endRegistration?: Date;
    hours?: number;
    image?: ContentfulImage;
    registeredAttendees?: Array<string>;
    presentAttendees?: Array<string>;
}

export interface ContentfulImage {
    assetID: string;
    url: string;
}

export class APIError extends Error {
    constructor(public statusCode: number, message?: string) {
        super(message);
    }
}
