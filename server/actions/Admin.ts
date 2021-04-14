import mongoDB from "../index";
import { Admin, APIError } from "utils/types";
import AdminSchema from "server/models/Admin";
import { hash, compare } from "bcrypt";
import { Secret, sign } from "jsonwebtoken";

/**
 * @param admin The admin that is attempting to login
 * @returns A signed JWT string
 */
export async function login(admin: Admin) {
    await mongoDB();
    if (!admin || !admin.email || !admin.password) {
        throw new APIError(400, "Missing admin information.");
    }

    const apparentAdmin = await AdminSchema.findOne({ email: admin.email });
    if (!apparentAdmin || !apparentAdmin.password) {
        throw new APIError(404, "Invalid email or password.");
    }

    const same = await compare(admin.password, apparentAdmin.password);
    if (!same) {
        throw new APIError(404, "Invalid email or password.");
    }

    const secret: Secret = process.env.JWTSECRET as string;
    const payload = {
        _id: apparentAdmin._id as string,
        email: apparentAdmin.email,
    };
    const options = {
        expiresIn: "7d",
    };
    return sign(payload, secret, options);
}

/**
 * Adds a new admin to the database.
 * @param admin The admin to be created and added to the database
 */
export async function createAdmin(admin: Admin) {
    await mongoDB();
    if (!admin || !admin.email || !admin.password) {
        throw new APIError(400, "Missing admin information.");
    }

    const exists = await doesAdminExist(admin.email);
    if (exists) {
        throw new APIError(404, "Account with this email already exists.");
    }

    const { email, password } = admin;
    const hashedPassword = await hash(password, 10);
    const newAdmin = {
        email,
        password: hashedPassword,
    };

    await AdminSchema.create(newAdmin);
}

export async function doesAdminExist(email: string) {
    await mongoDB();
    return AdminSchema.findOne({ email: email }) !== null;
}
