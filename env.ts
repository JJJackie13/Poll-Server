import dotenv from "dotenv";
dotenv.config();

export const env = {
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST || "localhost",
    PORT: process.env.PORT! || 8080,
    NODE_ENV: process.env.NODE_ENV || "development",
    JWTSECRET: process.env.JWTSECRET,
};
