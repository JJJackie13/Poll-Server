import * as bcrypt from "bcryptjs";

const saltRounds = 10;

export async function hashPassword(plainPassword: string) {
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
}

export async function checkPassword(plainPassword: string, hashedPassword: string) {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
}