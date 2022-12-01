import {
	Filter,
	MongoClient,
	Document,
	FindOptions,
	UpdateFilter,
	AggregateOptions,
} from 'mongodb';
import { WithId } from '../../../../common/types';

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

/**
 * Wrapper around MongoDB's `findOneAndUpdate` function.
 * It abstracts away the connection to MongoDB.
 * @template [T=Document]
 * @param {string} collectionName - The collection name
 * @param {Filter<Document>} filter - The filter
 * @param {UpdateFilter<Document>} update - The update document
 * @returns {Promise<false | WithId<T>>} The document before update or false
 */
export const findOneAndUpdate = async <T extends Document = Document>(
	collectionName: string,
	filter: Filter<Document>,
	update: UpdateFilter<Document>
): Promise<false | WithId<T>> => {
	try {
		const db = await connectToMongo();
		const collection = db.collection(collectionName);
		const result = await collection.findOneAndUpdate(filter, update);
		if (!result.value) {
			return false;
		}
		const { _id, ...rest } = result.value;
		return { id: _id.toString(), ...rest } as WithId<T>;
	} catch (error) {
		console.error({
			message: 'Unable to findOneAndUpdate',
			description: (error as Error).message,
			filter,
			update,
		});
		throw error;
	}
};

/**
 * Wrapper around MongoDB's `findOneAndDelete` function.
 * It abstracts away the connection to MongoDB.
 * @template [T=Document]
 * @param {string} collectionName - The collection name
 * @param {Filter<Document>} filter - The filter
 * @returns {Promise<false | WithId<T>>} The document before deletion or false
 */
export const findOneAndDelete = async <T extends Document = Document>(
	collectionName: string,
	filter: Filter<Document>
): Promise<false | WithId<T>> => {
	try {
		const db = await connectToMongo();
		const collection = db.collection(collectionName);
		const result = await collection.findOneAndDelete(filter);
		if (!result.value) {
			return false;
		}
		const { _id, ...rest } = result.value;
		return { id: _id.toString(), ...rest } as WithId<T>;
	} catch (error) {
		console.error({
			message: 'Unable to findOneAndDelete',
			description: (error as Error).message,
			filter,
		});
		throw error;
	}
};

/**
 * Wrapper around MongoDB's `updateOne` function.
 * It abstracts away the connection to MongoDB.
 * @param {string} collectionName - The collection name
 * @param {Filter<Document>} filter - The filter
 * @param {Partial<Document> | UpdateFilter<Document>} update - The update document
 * @returns {Promise<boolean>} True if successful else false
 */
export const updateOne = async (
	collectionName: string,
	filter: Filter<Document>,
	update: Partial<Document> | UpdateFilter<Document>
): Promise<boolean> => {
	try {
		const db = await connectToMongo();
		const collection = db.collection(collectionName);
		const result = await collection.updateOne(filter, update);
		if (!result.modifiedCount) {
			return false;
		}
		return true;
	} catch (error) {
		console.error({
			message: 'Unable to updateOne',
			description: (error as Error).message,
			filter,
			update,
		});
		throw error;
	}
};

/**
 * Wrapper around MongoDB's `aggregate` function.
 * It abstracts away the connection to MongoDB.
 * @param {string} collectionName - The collection name
 * @param {Document[]} pipeline - The aggregation pipeline
 * @param {AggregateOptions} options - The aggregate options
 * @returns {Promise<WithId<T>[]>} The documents
 */
export const aggregate = async <T extends Document = Document>(
	collectionName: string,
	pipeline: Document[],
	options?: AggregateOptions
): Promise<WithId<T>[]> => {
	try {
		const db = await connectToMongo();
		const collection = db.collection(collectionName);
		const cursor = await collection.aggregate(pipeline, options);
		const docs = await cursor.toArray();
		return docs as WithId<T>[];
	} catch (error) {
		console.error({
			message: 'Unable to aggregate',
			description: (error as Error).message,
			pipeline,
			options,
		});
		throw error;
	}
};
