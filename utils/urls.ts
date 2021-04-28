const prod = process.env.NODE_ENV === "production";

export default {
    baseUrl: prod ? "https://keep-knox-beautiful-git-develop-kfidan1.vercel.app" : "http://localhost:3000",
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
        updateVolunteer: (volId: string) => `/admin/volunteers/${volId}/update`,
    },
    api: {
        events: "/api/events",
        event: (eventId: string) => `/api/events/${eventId}`,
        eventVolunteers: (eventId: string, page: number) => `/api/events/${eventId}/volunteers?page=${page}`,
        signup: (eventId: string) => `/api/events/${eventId}/signup`,
        eventQuickadd: (eventId: string) => `/api/events/${eventId}/quickadd`,
        markPresent: (eventId: string, volId: string) => `/api/events/${eventId}/present/${volId}`,
        markNotPresent: (eventId: string, volId: string) => `/api/events/${eventId}/notPresent/${volId}`,
        volunteers: "/api/volunteers",
        volunteer: (volId: string) => `/api/volunteers/${volId}`,
        volunteerEvents: (volId: string) => `/api/volunteers/${volId}/events`,
        sendVerificationEmail: (volId: string) => `/api/volunteers/${volId}/email`,
        login: "/api/admin/login",
        logout: "/api/admin/logout",
        createAdminAccount: "/api/admin/signup",
        validateLogin: "/api/admin/validateLogin",
    },
};
