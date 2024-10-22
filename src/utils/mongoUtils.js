import { MongoClient } from 'mongodb';

/**
 * Connect to MongoDB.
 */
export async function connectToMongoDB(uri) {
    const client = new MongoClient(uri);
    await client.connect();
    return client;
}

/**
 * Execute MongoDB query (e.g., insert, update).
 */
export async function executeQuery(collection, operation, query, data = null) {
    switch (operation) {
        case 'insert':
            return await collection.insertOne(query);
        case 'update':
            return await collection.updateOne(query, { $set: data });
        default:
            throw new Error('Unknown operation');
    }
}

/**
 * Close MongoDB connection.
 */
export async function closeConnection(client) {
    await client.close();
}
