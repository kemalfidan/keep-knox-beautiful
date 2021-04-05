export default {
    org: {
        name: {
            full: "Keep Knoxville Beautiful",
            short: "KKB",
        },
        upcomingEventsDesc: "Join us for a workday!",
        images: {
            logo: "logo-transparent.png",
            banner: "banner.png",
            defaultCard: "logo-transparent.png",
        },
        footer: {
            address: "2743B Wimpole Avenue, Knoxville, TN 37914",
            phone: "(865) 521-6957",
            email: "info@Keepknoxvillebeautiful.org",
        },
    },
    revalidate: {
        upcomingEvents: 20,
        eventDesc: 30,
        allVolunteers: 10,
        eventVolunteers: 5,
        volunteerProfile: 10,
    },
    contentfulImageLimit: 20 * 1000 * 1000, // 20 MB
};

/* 
    Some notes:
        - waiver page at /src/pages/waiver.tsx needs to be changed for different orgs
        - update email verification address in env file
        - allow less secure apps: https://myaccount.google.com/lesssecureapps
        - update email template in server/actions/Volunteer.ts in createEmailBody()
*/
