import { Request, Response } from "express";
import twilio from "../helpers/twilio";
import otpCollection from "../models/otp.model";

export const sendOtp = async (req: Request, res: Response) => {
    try {
        // we will get phone number in body to send otp
        const sendTo: string = req.body.phoneNumber;
        // generating 4 digit random number for otp
        const otp =  Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        // now we have to save otp with the phone number for to avail it for further actions;
        await otpCollection.create({ phoneNumber: sendTo, otp })
        // writing a message to user including the otp
        const message = `Thank you for choosing our services. As a part of our security measures, 
        we are sending you a One-Time Password (OTP) to verify your identity.
        Your OTP is: ${otp}
        Please enter this OTP within next 5 minutes to complete the verification process. 
        If you did not request this OTP or have any concerns about your account security, 
        please contact our customer support immediately.`
        twilio(message, sendTo)
        .then( async (message) => {
            return res.json({ success: true, message: "OTP sent successfully"})
        })
        .catch((err) => {
            return res.json({ success: false, message: err})
        })
    } catch (error: any) {
        if (error.code === 11000) {
            return res.json({ success: false, message: "Use the otp already sent! or try to resend otp after some moments"})
        }
        return res.json({ success: false, message: error})
    }
}

export const resendOtp = async (req: Request, res: Response) => {
    try {
        // taking phonenumber from request body
        const sendTo: string = req.body.phoneNumber;
        // generating 4 digit random number for otp
        const otp =  Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        // now we have to save new otp with the phone number for to avail it for further actions;
        await otpCollection.findOneAndUpdate({ phoneNumber: sendTo},{ otp }, { upsert: true})
        // writing message
        const message = `Thank you for choosing our services. As a part of our security measures, 
        we are sending you a One-Time Password (OTP) to verify your identity.
        Your OTP is: ${otp}
        Please enter this OTP within next 5 minutes to complete the verification process. 
        If you did not request this OTP or have any concerns about your account security, 
        please contact our customer support immediately.`
        twilio( message, sendTo)
        .then( async (message) => {
            return res.json({ success: true, message: "OTP sent successfully"})
        })
        .catch((err) => {
            return res.json({ success: false, message: err})
        })
    } catch (error) {
        return res.json()
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    // we will get the user' phone number and otp user entered from request body
    const { phoneNumber, otp } = req.body;

    // first we will check that, is there have a otp document with the phone number or not;
    try {
        const otpDoc = await otpCollection.findOne({ phoneNumber: phoneNumber})
        if ( !otpDoc) {
            // if there is no document with the specified phone number?, it means otp is expired.
            return res.json({ success: false, message: "sorry, your otp is expired" })
        }
        // else we will continue in the next block;
    } catch (error) {
        return res.json({ success: false, message: error})
    }

    // now, we have to verify the otp;
    try {
        const otpMatching = await otpCollection.findOne({
            phoneNumber: phoneNumber,
            otp: otp
        })

        if (otpMatching) {
            return res.json({ success: true, message: "otp verified successfully"})
        } else {
            return res.json({ success: false, message: "please enter valid otp"})
        }
    } catch (error) {
        return res.json({ success: false, message: error})
    }
}