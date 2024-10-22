import { connectToMongoDB, executeQuery, closeConnection } from '../utils/mongoUtils.js';
import { dbConfig } from '../config/config.js';

const { uri, dbName, collectionName } = dbConfig;

/**
 * Insert metadata into MongoDB.
 */
export async function insertMetadata(metadata) {
    const client = await connectToMongoDB(uri);
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const newDocument = { ...metadata, _id: generateUniqueId() };
        await executeQuery(collection, 'insert', newDocument);
        return newDocument._id;
    } catch (error) {
        console.error('Error inserting metadata:', error);
        throw error;
    } finally {
        await closeConnection(client);
    }
}

/**
 * Update MongoDB document with processed data.
 */
export async function updateDocument(id, updateData) {
    const client = await connectToMongoDB(uri);
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        await executeQuery(collection, 'update', { _id: id }, updateData);
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    } finally {
        await closeConnection(client);
    }
}

/**
 * Dummy unique ID generator.
 */
function generateUniqueId() {
    return 'id_' + Date.now();
}

