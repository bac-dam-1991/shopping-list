import { Filter, MongoClient, Document, FindOptions } from 'mongodb';

export type WithId<T> = T & { id: string };

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
 * @template T
 * @param {string} collectionName - The collection name
 * @param {Filter<Document>} [filter={}] - The filter object, defaults to an empty object.
 * @param {FindOptions<Document>} [options] - The find options
 * @returns {Promise<WithId<T>[]>} Returns the array of objects with `id` instead of `_id`. The array of objects can be empty.
 */
export const find = async <T extends unknown>(
	collectionName: string,
	filter: Filter<Document> = {},
	options?: FindOptions<Document>
): Promise<WithId<T>[]> => {
	try {
		const db = await connectToMongo();
		const collection = db.collection(collectionName);
		const cursor = await collection.find(filter, options);
		const docs = await cursor.toArray();
		return docs.map(({ _id, ...rest }) => {
			return { ...rest, id: _id.toString() } as WithId<T>;
		});
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
 * @template T
 * @param {string} collectionName - The collection name
 * @param {Filter<Document>} [filter={}] - The filter object, defaults to an empty object.
 * @param {FindOptions<Document>} [options] - The find options
 * @returns {Promise<T | null>} Returns the object (if found) with `id` instead of `_id`. If no object found matching filter, it returns `null`.
 */
export const findOne = async <T extends unknown>(
	collectionName: string,
	filter: Filter<Document> = {},
	options?: FindOptions<Document>
): Promise<WithId<T> | null> => {
	try {
		const db = await connectToMongo();
		const collection = db.collection(collectionName);
		const doc = await collection.findOne(filter, options);
		if (!doc) {
			return null;
		}
		const { _id, ...rest } = doc;
		return { id: _id.toString(), ...rest } as WithId<T>;
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

/**
 * Wrapper around MongoDB's `insertOne` function.
 * It abstracts away the connection to MongoDB.
 * @template [T=Document]
 * @param {string} collectionName - The collection name
 * @param {T} document - The document to insert
 * @returns {Promise<WithId<T>>} The document with Id
 */
export const insertOne = async <T extends Document = Document>(
	collectionName: string,
	document: T
): Promise<WithId<T>> => {
	try {
		const db = await connectToMongo();
		const collection = db.collection(collectionName);
		const result = await collection.insertOne({ ...document });
		const id = result.insertedId.toString();
		return { id, ...document };
	} catch (error) {
		console.error({
			message: 'Unable to insertOne',
			description: (error as Error).message,
			document,
		});
		throw error;
	}
};
