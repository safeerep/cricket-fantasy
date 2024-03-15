import twilio from "twilio"

export default async ( DATA: string, SEND_TO: string) => {

    return new Promise((resolve, reject) => {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken)
        
        client.messages.create({
            from: process.env.MESSAGE_FROM,
            to: SEND_TO,
            body: DATA
        })
        .then((message) => {
            console.log(`message sent successfully`);
            resolve(message)
        })
        .catch((err) => {
            console.log(`an error happened during sending message ${err}`);
            reject(err)
        })
    })
}