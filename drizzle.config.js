/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_LCdqomNSce81@ep-red-sea-a5lvv1uz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
    }
};