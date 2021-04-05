const prod = process.env.NODE_ENV === "production";

export default {
    baseUrl: prod ? "http://prod_domain_here!" : "http://localhost:3000",
    dbUrl: process.env.MONGO_DB ?? "mongodb://localhost:27017",
    pages: {
        index: "/",
        event: (eventId: string) => `/events/${eventId}`,
        login: "/login",
        adminHome: "/admin",
        addEvent: "/admin/events/new",
        updateEvent: (eventId: string) => `/admin/events/${eventId}/update`,
        manageEvent: (eventId: string) => `/admin/events/${eventId}`,
        volunteers: "/admin/volunteers",
        volunteer: (volId: string) => `/admin/volunteers/${volId}`,
    },
    api: {
        events: "/api/events",
        event: (eventId: string) => `/api/events/${eventId}`,
        eventVolunteers: (eventId: string) => `/api/events/${eventId}/volunteers`,
        signup: (eventId: string) => `/api/events/${eventId}/signup`,
        markPresent: (eventId: string, volId: string) => `/api/events/${eventId}/present/${volId}`,
        markNotPresent: (eventId: string, volId: string) => `/api/events/${eventId}/notPresent/${volId}`,
        volunteers: "/api/volunteers",
        volunteer: (volId: string) => `/api/volunteers/${volId}`,
        sendVerificationEmail: (volId: string) => `/api/volunteers/${volId}/email`,
    },
};
