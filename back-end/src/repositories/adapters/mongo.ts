import { Filter, MongoClient, Document, FindOptions } from 'mongodb';

export const connectToMongo = async () => {
	try {
		const DatabaseName = 'shopping-list-app';
		const ConnectionString = 'mongodb://localhost:27017';
		const client = new MongoClient(ConnectionString);
		await client.connect();
		return client.db(DatabaseName);
	} catch (error) {
		console.error({
			message: 'Cannot create Mongo client',
			description: (error as Error).message,
		});
		throw error;
	}
};

/**
 * Wrapper around MongoDB's `find` function.
 * It abstracts away the connection to MongoDB.
 * @param {string} collectionName - The collection name
 * @param {Filter<Document>} [filter={}] - The filter object, defaults to an empty object.
 * @param {FindOptions<Document>} [options] - The find options
 * @returns {Promise<T[]>} Returns the array of objects with `id` instead of `_id`. The array of objects can be empty.
 */
export const find = async <T extends unknown>(
	collectionName: string,
	filter: Filter<Document> = {},
	options?: FindOptions<Document>
): Promise<T[]> => {
	try {
		const db = await connectToMongo();
		const collection = db.collection(collectionName);
		const cursor = await collection.find(filter, options);
		const docs = await cursor.toArray();
		return docs.map(({ _id, ...rest }) => {
			return { ...rest, id: _id.toString() };
		}) as T[];
	} catch (error) {
		console.error({
			message: 'Unable to find',
			description: (error as Error).message,
			filter,
			options,
		});
		throw error;
	}
};

/**
 * Wrapper around MongoDB's `findOne` function.
 * It abstracts away the connection to MongoDB.
 * @param {string} collectionName - The collection name
 * @param {Filter<Document>} [filter={}] - The filter object, defaults to an empty object.
 * @param {FindOptions<Document>} [options] - The find options
 * @returns {Promise<T | null>} Returns the object (if found) with `id` instead of `_id`. If no object found matching filter, it returns `null`.
 */
export const findOne = async <T extends unknown>(
	collectionName: string,
	filter: Filter<Document> = {},
	options?: FindOptions<Document>
): Promise<T | null> => {
	try {
		const db = await connectToMongo();
		const collection = db.collection(collectionName);
		const doc = await collection.findOne(filter, options);
		if (!doc) {
			return null;
		}
		const { _id, ...rest } = doc;
		return { id: _id.toString(), ...rest } as T;
	} catch (error) {
		console.error({
			message: 'Unable to findOne',
			description: (error as Error).message,
			filter,
			options,
		});
		throw error;
	}
};
