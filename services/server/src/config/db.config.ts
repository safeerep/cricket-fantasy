import mongoose from "mongoose"

export default () => {
    const MONGODB_URI = process.env.MONGODB_URI || ''
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log(`db connected successfully with circket fantasy server`);
        })
        .catch((error) => {
            console.log(`something went wrong during connecting with database`);
            return false;
        })

}