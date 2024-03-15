import { Router } from "express"
import { 
    sendOtp, 
    resendOtp,
    verifyOtp
} from "../controllers/otp.controller"
import {
    login,
    regiser,
    getUserProfile
} from "../controllers/user.controller"

const router = Router()
// to reques for send otp
router.post('/send-otp', sendOtp)
// to resend otp, after a specified time period from otp sent
router.post('/resend-otp', resendOtp)
// to verify user entered otp with previously sent one
router.post('/verify-otp', verifyOtp)

// to verify password and let user to login
router.post('/login', login)
// to create account for a new user;
router.post('/register', regiser)
// to retrieve user profile details;
router.get('/get-profile', getUserProfile )

// to retrieve wallet details
router.get('/wallet')
// to fetch the transaction history of the user
router.get('/wallet-history')
// to add cash into wallet
router.patch('/add-to-wallet')
// to withdraw money from wallet
router.patch('/withdraw-money')

export default router;