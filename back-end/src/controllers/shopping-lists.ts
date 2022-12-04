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
	ShoppingListNameSchema,
	ItemIdSchema,
	ItemNameSchema,
	ItemQuantitySchema,
	ItemStatusSchema,
	ItemUnitSchema,
	ShoppingListIdSchema,
	UserSubSchema,
} from '../../../common/schemas';
const router = express.Router();

router.get('', async (req, res, next) => {
	try {
		const sub = (req as any).auth.sub;
		const shoppingLists = await findAllShoppingLists(sub);
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
		const sub = (req as any).auth.sub;
		const Schema = Joi.object().keys({
			sub: UserSubSchema,
			name: ShoppingListNameSchema,
		});
		validateAndThrowOnError(Schema, { name, sub });
		const shoppingList = await addNewShoppingList({ name, sub });
		res.status(201).json(shoppingList);
	} catch (error) {
		next(error);
	}
});

router.put('/:id', async (req, res, next) => {
	try {
		const { name } = req.body;
		const { id } = req.params;
		const sub = (req as any).auth.sub;
		const Schema = Joi.object().keys({
			id: ShoppingListIdSchema,
			name: ShoppingListNameSchema,
			sub: UserSubSchema,
		});
		validateAndThrowOnError(Schema, { id, name, sub });
		const updatedShoppingList = await updateShoppingList(id, { name, sub });
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
		const Schema = Joi.object().keys({
			id: ShoppingListIdSchema,
			name: ItemNameSchema,
			status: ItemStatusSchema,
			quantity: ItemQuantitySchema,
			unit: ItemUnitSchema,
		});
		validateAndThrowOnError(Schema, { id, name, status, quantity, unit });
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
		const Schema = Joi.object().keys({
			id: ShoppingListIdSchema,
			itemId: ItemIdSchema,
		});
		validateAndThrowOnError(Schema, { id, itemId });
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
		const Schema = Joi.object().keys({
			id: ShoppingListIdSchema,
			itemId: ItemIdSchema,
			name: ItemNameSchema.optional(),
			status: ItemStatusSchema.optional(),
			quantity: ItemQuantitySchema.optional(),
			unit: ItemUnitSchema.optional(),
		});
		validateAndThrowOnError(Schema, {
			id,
			name,
			status,
			quantity,
			unit,
			itemId,
		});
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
