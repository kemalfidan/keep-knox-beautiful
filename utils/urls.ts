const prod = process.env.NODE_ENV === "production";

export default {
    baseUrl: prod ? "http://prod_domain_here!" : "http://localhost:3000",
    dbUrl: process.env.MONGO_DB ?? "mongodb://localhost:27017",
    pages: {
        index: "/",
    },
    api: {},
};
