import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserSchema = new Schema<IUser>(
    {
        id: { type: String, unique: true, required: true, trim: true },
        email: { type: String, unique: true, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        password: { type: String, required: true, trim: true },
        status: {
            type: Number,
            required: true,
            default: 1,
        },
        // phone: { type: String, trim: true },
        anddresses: [
            {
                street: { type: String, required: true, trim: true },
                street_number: { type: String, required: true, trim: true },
                zipcode: { type: String, required: true, trim: true },
                city: { type: String, required: true, trim: true },
                state: { type: String, required: true, trim: true },
                complement: { type: String, trim: true },
            },
        ],
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("users", UserSchema);

export { User };
