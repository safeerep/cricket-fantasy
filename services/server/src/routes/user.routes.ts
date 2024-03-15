import { Router } from "express"
import { 
    sendOtp, 
    resendOtp,
    verifyOtp
} from "../controllers/otp.controller"
import {
    login,
    regiser,
    getUserProfile,
    logout
} from "../controllers/user.controller"
import { 
    addMoneyToWallet,
    getUserWallet, 
    getWalletTransactionHistory, 
    withdrawMoneyFromWallet
} from "../controllers/wallet.controller"
import checkAuth from "../middlewares/check.auth"

const router = Router()
// to reques for send otp
router.post('/send-otp', sendOtp)
// to resend otp, after a specified time period from otp sent
router.post('/resend-otp', resendOtp)
// to verify user entered otp with previously sent one
router.post('/verify-otp', verifyOtp)

// to verify password and let user to login
router.post('/login', login)
// let user to log out from application
router.get('/logout', logout)
// to create account for a new user;
router.post('/register', regiser)
// here onwards, for to get following routes, user required to be logged in;
router.use(checkAuth)
// to retrieve user profile details;
router.get('/get-profile', getUserProfile )

// to retrieve wallet details
router.get('/wallet', getUserWallet)
// to fetch the transaction history of the user
router.get('/wallet-history', getWalletTransactionHistory)
// to add cash into wallet
router.patch('/add-money', addMoneyToWallet)
// to withdraw money from wallet
router.patch('/withdraw-money', withdrawMoneyFromWallet)

export default router;