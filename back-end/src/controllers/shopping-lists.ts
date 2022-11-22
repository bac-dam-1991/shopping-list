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
		const schema = Joi.string().length(24).messages({
			'string.length': 'Shopping list Id needs to be {#limit} characters long.',
		});
		validateAndThrowOnError(schema, id);
		const shoppingList = await getShoppingListById(id);
		res.status(200).json(shoppingList);
	} catch (error) {
		next(error);
	}
});

router.post('', async (req, res, next) => {
	try {
		const { name } = req.body;
		const schema = Joi.string().min(3).max(50).required().messages({
			'any.required': 'Shopping list name is required.',
			'string.min':
				'Shopping list name needs to be at least {#limit} characters long.',
			'string.max':
				'Shopping list name cannot be more than {#limit} characters long.',
		});
		validateAndThrowOnError(schema, name);
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
