// Keep these in sync with the backend schema

export interface Volunteer {
    _id?: string;
    email?: string;
    name: string;
    phone?: string;
    totalEvents?: number; // num attended events
    totalHours?: number; // aggregate of attended event hours
    registeredEvents?: (string | Event)[]; // objectid ref is a string
    attendedEvents?: (string | Event)[];
}

export interface Event {
    _id?: string;
    name: string;
    description?: string;
    caption?: string;
    maxVolunteers?: number;
    volunteerCount?: number; // registered + attended
    location?: string;
    groupSignUp?: boolean;
    startDate?: Date;
    endDate?: Date;
    startRegistration?: Date;
    endRegistration?: Date;
    hours?: number;
    image?: ContentfulImage;
    registeredVolunteers?: (string | Volunteer)[]; // objectid ref is a string
    attendedVolunteers?: (string | Volunteer)[];
}

export interface Admin {
    _id: string;
    email: string;
    password?: string;
}

export interface PaginatedVolunteers {
    volunteers: Volunteer[];
    registeredCount: number;
}
export interface LoadMorePaginatedData {
    data: (Event | Volunteer)[];
    isLastPage: boolean;
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

export interface ApiResponse {
    success: boolean;
    message?: string;
    payload?: unknown;
}

// used to keep track for display
// purposes
export interface EventVolunteer {
    volunteer: Volunteer;
    present: boolean;
}
