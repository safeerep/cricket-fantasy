import { Schema, model } from "mongoose";

interface IOTP {
    phoneNumber: string;
    otp: number;
    createdOn?: Date;
}

const otpSchema: Schema = new Schema(
    {
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        otp: {
            type: Number,
            required: true,
        },
        createdOn: {
            type: Date,
            expires: "10m",
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default model<IOTP>("otp", otpSchema)