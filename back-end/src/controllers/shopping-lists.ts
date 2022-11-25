import express from 'express';
import { findAllShoppingLists } from '../repositories/shopping-lists';
import {
	addNewItemToShoppingList,
	addNewShoppingList,
	deleteShoppingList,
	getShoppingListById,
	removeItemFromShoppingList,
	updateShoppingItem,
	updateShoppingList,
} from '../services/shopping-lists';
import Joi from 'joi';
import { validateAndThrowOnError } from './validation';
import {
	ShoppingListIdSchema,
	ShoppingListNameSchema,
} from './schemas/shopping-lists';
const router = express.Router();

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
		validateAndThrowOnError(ShoppingListIdSchema, id);
		const shoppingList = await getShoppingListById(id);
		res.status(200).json(shoppingList);
	} catch (error) {
		next(error);
	}
});

router.post('', async (req, res, next) => {
	try {
		const { name } = req.body;
		validateAndThrowOnError(ShoppingListNameSchema, name);
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
		const Schema = Joi.object().keys({
			id: ShoppingListIdSchema,
			name: ShoppingListNameSchema,
		});
		validateAndThrowOnError(Schema, { id, name });
		const updatedShoppingList = await updateShoppingList(id, { name });
		res.status(200).json(updatedShoppingList);
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		validateAndThrowOnError(ShoppingListIdSchema, id);
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
		const result = await removeItemFromShoppingList(id, itemId);
		res.status(200).json(result);
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
