import { Request, Response } from "express";
import { IWALLET } from "../models/wallet.model";
import walletCollection from "../models/wallet.model";
import destructureToken from "../helpers/jwt/destructure.token";

export const getUserWallet = async (req: Request, res: Response) => {
    try {
        // only authenticated users can get this route so, we can get token from cookies
        const token: string = req.cookies.jwtToken;
        const userId: string | boolean | unknown = String( await destructureToken(token))
        const userWallet: IWALLET | null = await walletCollection.findOne({
            userId: userId
        })
        if (!userWallet) {
            await walletCollection.create({
                userId
            })
            return res.json({ success: true, message: "user's wallet is empty"})
        } else {
            return res.json({ success: true, userWallet, message: "successfully fetched user wallet"})
        }
    } catch (error) {
        console.log(`hey safee.. something went wrong during retrieiving user wallet ${error}`);
        return res.status(500).json({ success: false, message: error })
    }
}

export const addMoneyToWallet = async ( req: Request, res: Response) => {
    try {
        // it will be a patch request with the body which contains the amount of money to add;
        const { amount } = req.body;
        if (amount <= 0) {
            return res.json({ success: false, message: "the amount of money adding should be a positive integer"})
        }
        // we will get token from cookies and then userId from token
        const token: string = req.cookies.jwtToken;
        const userId: string | boolean | unknown = await destructureToken(token)

        // first we will find user wallet
        const existingWallet: IWALLET | null = await walletCollection.findOne({
            userId: userId
        }) 
        if ( !existingWallet) {
            const userWallet: IWALLET = await walletCollection.create({
                userId,
                walletBalance: amount,
                walletHistory: [
                    {
                        amount: amount,
                        transactionType: "deposit"
                    }
                ]
            })
            return res.json({ success: true, userWallet, message: "successfully added money to wallet"})
        } else {
            const updatedUserWallet = await walletCollection.findOneAndUpdate(
                {
                    userId: userId
                }, {
                    $inc: {
                        walletBalance: amount
                    },
                    $push: {
                        walletHistory: {
                            amount: amount,
                            transactionType: "deposit"
                        }
                    }
                }
            )

            return res.json({ success: true, userWallet: updatedUserWallet, message: "successfully updated user wallet"})
        }
    } catch (error) {
        console.log(`hey safee.. something went wrong during adding money to wallet ${error}`);
        return res.json({ success: false, message: error })
    }
}

export const withdrawMoneyFromWallet = async ( req: Request, res: Response) => {
    // it will be a patch request same as to add money but here withdraws money
    try {
        const { amount } = req.body;
        if (amount <= 0)  {
            return res.json({ success: false, message: "the amount of money, trying to withdraw should be a positive integer"})
        }
        // we will get token from cookies and then userId from token
        const token: string = req.cookies.jwtToken;
        const userId: string | boolean | unknown = await destructureToken(token)
        // first we will find user wallet
        const existingWallet: IWALLET | null = await walletCollection.findOne({
            userId: userId
        }) 
        if ( !existingWallet) {
            await walletCollection.create({
                userId
            })
            // no wallet was there now just created it
            return res.json({ success: true, message: "your wallet balance is not enough to make this withdrawal"})
        } else {
            if ( existingWallet.walletBalance < amount) {
                return res.json({ success: true, message: "your wallet balance is not enough to make this withdrawal"})
            } else {
                // its the only situation where user can withdraw money
                const updatedUserWallet = await walletCollection.findOneAndUpdate(
                    {
                        userId: userId
                    }, {
                        $inc: {
                            walletBalance: -amount
                        },
                        $push: {
                            walletHistory: {
                                amount: amount,
                                transactionType: "withdraw"
                            }
                        }
                    }, {
                        new: true
                    }
                )

                return res.json({ success: true, userWallet: updatedUserWallet, message: `successfully withdrawn the amout ${amount} and remaining balance is ${updatedUserWallet?.walletBalance}`})
            }
        }

    } catch (error) {
        console.log(`hey safee.. something went wrong during withdrawing money from wallet ${error}`);
        return res.status(500).json({ success: false, message: error})
    }
}

export const getWalletTransactionHistory = async ( req: Request, res: Response) => {
    
}