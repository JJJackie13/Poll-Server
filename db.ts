import { Client } from "pg";
import { env } from "./env";

export const client = new Client({
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    host: env.DB_HOST,
});
client.connect();