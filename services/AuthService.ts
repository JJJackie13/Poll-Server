import { Knex } from "knex";

export class AuthService {
    constructor(private knex: Knex) {}
    getUserInfo = async (hkid: string) => {
        const user = await this.knex("users")
            .select("*")
            .where("hkid", hkid);
        return user;
    };
    register = async (
        hkid: string,
        lastName: string,
        hashedPassword: string,
        phone: string
    ) => {
        try {
            await this.knex("users").insert({
                hkid: hkid,
                last_name: lastName,
                password: hashedPassword,
                phone,
            });
            return { success: true };
        } catch (error) {
            console.log("REGISTER", error);
            return { success: false };
        }
    };
}