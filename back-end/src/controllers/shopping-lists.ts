import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
const router = express.Router();

const ShoppingListCollection = 'shopping-lists';

const connectToMongo = async () => {
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

router.get('', async (req, res) => {
	const db = await connectToMongo();
	const collection = db.collection(ShoppingListCollection);
	const cursor = await collection.find();
	const shoppingLists = await cursor.toArray();
	res.status(200).json(
		shoppingLists.map(({ _id, ...rest }) => {
			return { ...rest, id: _id.toString() };
		})
	);
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	const db = await connectToMongo();
	const collection = db.collection(ShoppingListCollection);
	const result = await collection.findOne({ _id: new ObjectId(id) });
	if (!result) {
		res.status(404).json('Shopping list does not exist.');
		return;
	}
	const { _id, ...rest } = result;
	res.status(200).json({ id: _id.toString(), ...rest });
});

router.post('', async (req, res) => {
	const { name } = req.body;
	const db = await connectToMongo();
	const collection = db.collection(ShoppingListCollection);
	const doc = await collection.insertOne({ name });
	res.status(201).json({ name, id: doc.insertedId });
});

router.put('/:id', async (req, res) => {
	const { name } = req.body;
	const { id } = req.params;
	const db = await connectToMongo();
	const collection = db.collection(ShoppingListCollection);
	const result = await collection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: { name } }
	);
	if (!result.value) {
		res.status(404).json('Shopping list does not exist.');
		return;
	}
	const { _id, ...rest } = result.value;
	res.status(200).json({ id: _id.toString(), ...rest });
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	const db = await connectToMongo();
	const collection = db.collection(ShoppingListCollection);
	const result = await collection.findOneAndDelete({ _id: new ObjectId(id) });
	if (!result.value) {
		res.status(404).json('Shopping list does not exist.');
		return;
	}
	const { _id, ...rest } = result.value;
	res.status(200).json({ id: _id.toString(), ...rest });
});

export default router;
