import { Request, Response } from "express";
import regiserValidationSchema from "../helpers/validators/register.validator";
import loginValidationSchema from "../helpers/validators/login.validator";
import userCollection from "../models/user.model";
import otpCollection from "../models/otp.model";
import { IUSER } from "../models/user.model";
import bcrypt from "bcrypt"
import generateToken from "../helpers/jwt/generate.token";
import destructureToken from "../helpers/jwt/destructure.token";

export const regiser = async (req: Request, res: Response) => {
    // we will get user credentials in request body;
    const {
        phoneNumber,
        otp,
        password
    } = req.body;

    // first we will validate the data with predefined schema
    try {
        await regiserValidationSchema.validate(req.body, {
            abortEarly: true
        })
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.errors[0] });
    }

    // we have to verify that, this user is not yet registered with us;
    try {
        const userExisting = await userCollection.findOne({
            phoneNumber
        })
        if (userExisting) {
            return res.status(409).json({ success: false, message: "You are already registered, try to login" })
        }
        // else we will continue in the next block;
    } catch (error) {
        return res.status(503).json({ success: false, message: error })
    }

    // now we have to check otp is matching or not;
    try {
        const otpDoc = await otpCollection.findOne({ phoneNumber: phoneNumber })
        if (!otpDoc) {
            // if there is no document with the specified phone number?, it means otp is expired.
            return res.json({ success: false, message: "sorry, your otp is expired" })
        } else {
            const otpMatching = await otpCollection.findOne({
                phoneNumber: phoneNumber,
                otp: otp
            })
            if (!otpMatching) {
                return res.json({ success: false, message: "please enter valid otp" })
            }
            // else we can save user credentials in next block;
        }
    } catch (error) {
        return res.status(503).json({ success: false, message: error })
    }

    // now only we will save the user data to db;
    try {
        const SALT_ROUNDS: number = Number(process.env.SALT_ROUNDS) || 10;
        req.body.password = bcrypt.hashSync(password, SALT_ROUNDS)
        const newUser = await userCollection.create(req.body)

        // then we can give jwt token for the user
        const token: string = generateToken(String(newUser._id))
        res.cookie("jwtToken", token, { maxAge: 30 * 24 * 60 * 60 * 1000 })
        return res.status(201).json({ success: true, userData: newUser, token, message: "successfully created new user" })
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "You are already registered, try to login" })
        }
        return res.status(503).json({ success: false, message: error })
    }
}

export const login = async (req: Request, res: Response) => {
    // we will get only phone number and password from user
    const {
        phoneNumber,
        password
    } = req.body;

    // first we will validate the data came
    try {
        await loginValidationSchema.validate(req.body, {
            abortEarly: true
        })
    } catch (error: any) {
        // if validations fails;
        return res.json({ success: false, message: error.errors[0] })
    }

    // then, we will check the phone number and password is valid or not
    try {
        const userExisting: IUSER | any = await userCollection.findOne({
            phoneNumber: phoneNumber
        })
        if (!userExisting) {
            return res.json({ success: false, message: "invalid phone number" })
        } else {
            // now we have to check password is matching or not;
            const matchingPassword = bcrypt.compareSync(password, userExisting.password)
            if (!matchingPassword) {
                return res.json({ success: false, message: "password is not matching" })
            } else {
                // now we verified the user so we can give token
                const token: string = generateToken(String(userExisting._id))
                res.cookie("jwtToken", token, { maxAge: 30 * 24 * 60 * 60 * 1000 })
                return res.status(200).json({ success: true, userData: userExisting, token, message: "successfully logged in" })
            }
        }
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        // it will be a get request so, we have to take userId from cookies by destructuring token;
        const token: string = req.cookies.jwtToken;
        const userId: string | boolean | unknown = await destructureToken(token)

        // now we can fetch userdata by using userId;
        const userData: IUSER | null = await userCollection.findById(userId)
        return res.status(200).json({ success: true, userData, message: "user profile fetched successfully"})
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

export const logout = async ( req: Request, res: Response) => {
    try {
        res.clearCookie("jwtToken")
        return res.json({ success: true, message: "successfully logged out"})
    } catch (error) {
        return res.json({ success: false, message: error})
    }
}