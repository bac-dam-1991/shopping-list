import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { ResourceDoesNotExistError } from '../custom-errors/ResourceDoesNotExistError';
import { UpdateError } from '../custom-errors/UpdateError';
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

router.get('', async (req, res, next) => {
	try {
		const db = await connectToMongo();
		const collection = db.collection(ShoppingListCollection);
		const cursor = await collection.find();
		const shoppingLists = await cursor.toArray();
		res.status(200).json(
			shoppingLists.map(({ _id, ...rest }) => {
				return { ...rest, id: _id.toString() };
			})
		);
	} catch (error) {
		next(error);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const db = await connectToMongo();
		const collection = db.collection(ShoppingListCollection);
		const result = await collection.findOne({ _id: new ObjectId(id) });
		if (!result) {
			throw new ResourceDoesNotExistError('Shopping list does not exist.');
		}
		const { _id, ...rest } = result;
		res.status(200).json({ id: _id.toString(), ...rest });
	} catch (error) {
		next(error);
	}
});

router.post('', async (req, res, next) => {
	try {
		const { name } = req.body;
		const db = await connectToMongo();
		const collection = db.collection(ShoppingListCollection);
		const doc = await collection.insertOne({ name });
		res.status(201).json({ name, id: doc.insertedId });
	} catch (error) {
		next(error);
	}
});

router.put('/:id', async (req, res, next) => {
	try {
		const { name } = req.body;
		const { id } = req.params;
		const db = await connectToMongo();
		const collection = db.collection(ShoppingListCollection);
		const result = await collection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: { name } }
		);
		if (!result.value) {
			throw new ResourceDoesNotExistError('Shopping list does not exist.');
		}
		const { _id, ...rest } = result.value;
		res.status(200).json({ id: _id.toString(), ...rest });
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const db = await connectToMongo();
		const collection = db.collection(ShoppingListCollection);
		const result = await collection.findOneAndDelete({ _id: new ObjectId(id) });
		if (!result.value) {
			throw new ResourceDoesNotExistError('Shopping list does not exist.');
		}
		const { _id, ...rest } = result.value;
		res.status(200).json({ id: _id.toString(), ...rest });
	} catch (error) {
		next(error);
	}
});

router.post('/:id/items/add', async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, status, quantity, unit } = req.body;
		const itemId = new ObjectId().toString();
		const newItem = { id: itemId, name, status, quantity, unit };
		const db = await connectToMongo();
		const collection = db.collection(ShoppingListCollection);
		const result = await collection.updateOne(
			{
				_id: new ObjectId(id),
			},
			{
				$push: {
					items: newItem,
				},
			}
		);
		if (!result.modifiedCount) {
			throw new UpdateError('Unable to add item to shopping list');
		}
		res.status(201).json(newItem);
	} catch (error) {
		next(error);
	}
});

router.put('/:id/items/:itemId/delete', async (req, res, next) => {
	try {
		const { id, itemId } = req.params;
		const db = await connectToMongo();
		const collection = db.collection(ShoppingListCollection);
		const pipeline = [
			{
				$match: {
					_id: new ObjectId(id),
				},
			},
			{
				$unwind: {
					path: '$items',
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$replaceRoot: {
					newRoot: '$items',
				},
			},
			{
				$match: {
					id: itemId,
				},
			},
		];

		const cursor = await collection.aggregate(pipeline);
		const docs = await cursor.toArray();
		if (!docs.length) {
			throw new UpdateError('Item does not exist in shopping list');
		}
		const itemToRemove = docs[0];
		const result = await collection.updateOne(
			{
				_id: new ObjectId(id),
			},
			{
				$pull: {
					items: itemToRemove,
				},
			}
		);
		if (!result.modifiedCount) {
			throw new UpdateError('Unable to remove item from shopping list');
		}
		res.status(200).json(itemId);
	} catch (error) {
		next(error);
	}
});

router.put('/:id/items/:itemId/update', async (req, res, next) => {
	try {
		const { id, itemId } = req.params;
		const { name, quantity, unit, status } = req.body;
		const db = await connectToMongo();
		const collection = db.collection(ShoppingListCollection);
		const pipeline = [
			{
				$match: {
					_id: new ObjectId(id),
				},
			},
			{
				$unwind: {
					path: '$items',
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$replaceRoot: {
					newRoot: '$items',
				},
			},
			{
				$match: {
					id: itemId,
				},
			},
		];

		const cursor = await collection.aggregate(pipeline);
		const docs = await cursor.toArray();
		if (!docs.length) {
			throw new UpdateError('Item does not exist in shopping list');
		}
		const itemToUpdate = docs[0];
		const result = await collection.updateOne(
			{
				_id: new ObjectId(id),
				'items.id': itemId,
			},
			{
				$set: {
					'items.$': {
						id: itemId,
						name: name || itemToUpdate.name,
						quantity: quantity || itemToUpdate.quantity,
						status: status || itemToUpdate.status,
						unit: unit || itemToUpdate.unit,
					},
				},
			}
		);
		if (!result.modifiedCount) {
			throw new UpdateError('Unable to update item in shopping list');
		}
		res.status(200).json(itemId);
	} catch (error) {
		next(error);
	}
});

export default router;
