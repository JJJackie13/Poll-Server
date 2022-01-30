import { env } from "./env";

export default {
    jwtSecret: env.JWTSECRET as string,
    jwtSession: {
        session: false,
    },
};
