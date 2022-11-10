import express from 'express';
import { ObjectId } from 'mongodb';
import { UpdateError } from '../custom-errors/UpdateError';
import { connectToMongo } from '../repositories/adapters/mongo';
import { findAllShoppingLists } from '../repositories/shopping-lists';
import {
	addNewItemToShoppingList,
	addNewShoppingList,
	deleteShoppingList,
	getShoppingListById,
	updateShoppingItem,
	updateShoppingList,
} from '../services/shopping-lists';
const router = express.Router();

const ShoppingListCollection = 'shopping-lists';

router.get('', async (req, res, next) => {
	try {
		const shoppingLists = await findAllShoppingLists();
		res.status(200).json(shoppingLists);
	} catch (error) {
		next(error);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const shoppingList = await getShoppingListById(id);
		res.status(200).json(shoppingList);
	} catch (error) {
		next(error);
	}
});

router.post('', async (req, res, next) => {
	try {
		const { name } = req.body;
		const shoppingList = await addNewShoppingList(name);
		res.status(201).json(shoppingList);
	} catch (error) {
		next(error);
	}
});

router.put('/:id', async (req, res, next) => {
	try {
		const { name } = req.body;
		const { id } = req.params;
		const updatedShoppingList = await updateShoppingList(id, { name });
		res.status(200).json(updatedShoppingList);
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await deleteShoppingList(id);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
});

router.post('/:id/items/add', async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, status, quantity, unit } = req.body;
		const result = await addNewItemToShoppingList(id, {
			name,
			status,
			quantity,
			unit,
		});
		res.status(201).json(result);
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
		const result = await updateShoppingItem(id, {
			id: itemId,
			name,
			quantity,
			unit,
			status,
		});
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
});

export default router;
