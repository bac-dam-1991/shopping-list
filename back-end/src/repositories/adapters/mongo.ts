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
