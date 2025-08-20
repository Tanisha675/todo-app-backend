import { MongoClient } from 'mongodb';

let db = null;
const CLUSTER_URL = "mongodb+srv://kom062004:nJiFkTqx6Tyrdb6L@cluster0.n2laviu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(CLUSTER_URL);

async function connectToDatabase(dbName) {
    if (db == null) {
        try {
            console.log("Connecting to MongoDB...");
            await client.connect();
            db = client.db(dbName);
            console.log(`Database connected to "${dbName}"`);
        } catch (e) {
            console.error(`Database connection error: ${e.message}`);
        }
    } else {
        console.log("Database already connected");
    }
    return db;
}

export default connectToDatabase;