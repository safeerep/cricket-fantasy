import { Schema, model } from "mongoose"

interface WALLETTRANSACTION {
    amount: number;
    transactionType: string
}
export interface IWALLET {
    userId: string;
    walletBalance: number;
    walletHistory: WALLETTRANSACTION[]
}

const walletSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true
    },
    walletBalance: {
        type: Number,
        required: true,
        default: 0
    },
    walletHistory: [
        {
            amount: {
                type: Number,
                required: true
            },
            transactionType: {
                type: String,
                required: true,
                enum: ["deposit", "withdraw"]
            }
        }
    ]
})

export default model<IWALLET>("wallet", walletSchema)