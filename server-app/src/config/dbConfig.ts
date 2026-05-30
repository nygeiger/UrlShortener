import mongoose from "mongoose";
import { logger } from "../middleware/logger.js";

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`);
        logger.logInfo(`Database connected: ${connect.connection.host} (${connect.connection.name})`);
    } catch (error) {
        logger.logError("Failed to connect to database", error);
        process.exit(1);
    }
}

export default connectDb;