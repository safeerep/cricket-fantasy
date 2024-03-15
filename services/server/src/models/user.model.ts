import { Schema, model } from "mongoose";

export interface IUSER {
    name: string;
    email: string;
    phoneNumber: number;
    password: string;
    dateOfBirth: Date;
    gender: string;
    country: string;
    state: string;
    city: string;
}

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    phoneNumber: {
        type: Number,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String
    }
})

export default model<IUSER>("user", userSchema)