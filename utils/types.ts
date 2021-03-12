// Keep these in sync with the backend schema

export interface Volunteer {
    _id?: string;
    email?: string;
    name: string;
    phone?: string;
    // filledForm?: boolean;
    totalEvents?: number;
    totalHours?: number;
    attendedEvents?: Event[];
    registeredEvents?: Event[];
}

export interface Event {
    _id?: string;
    name: string;
    description?: string;
    caption?: string;
    maxVolunteers?: number;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    startRegistration?: Date;
    endRegistration?: Date;
    hours?: number;
    image?: ContentfulImage;
    registeredVolunteers?: Volunteer[];
    attendedVolunteers?: Volunteer[];
}

export interface ContentfulImage {
    assetID: string;
    url: string;
}

export class APIError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
    }
}
