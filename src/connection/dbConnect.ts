import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

export default async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already Connected");
        return
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}`)
        
        connection.isConnected = db.connections[0].readyState

        console.log("***********************************************")
        console.log(db) // Delete me after observing.
        console.log("***********************************************")

        console.log("DB Connected Successfully.")
    } catch (error) {
        
        console.log("Database Connection Failed")
        process.exit()
    }
}

