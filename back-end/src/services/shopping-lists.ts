import { DuplicationError } from '../custom-errors/DuplicationError';
import { ResourceDoesNotExistError } from '../custom-errors/ResourceDoesNotExistError';
import { UpdateError } from '../custom-errors/UpdateError';
import { WithId, WithOptionalId } from '../repositories/adapters/mongo';
import {
	ShoppingList,
	findShoppingListById,
	insertNewShoppingList,
	findShoppingListsByName as findShoppingListsByName,
	updateShoppingListById,
	deleteShoppingListById,
	ShoppingItem,
	addItemToShoppingList,
} from '../repositories/shopping-lists';

/**
 * Get shopping list by Id.
 * If not found, an error will be thrown.
 * @param {string} shoppingListId - The shopping list Id
 * @returns {Promise<ShoppingList>} The shopping list
 */
export const getShoppingListById = async (
	shoppingListId: string
): Promise<ShoppingList> => {
	try {
		const result = await findShoppingListById(shoppingListId);
		if (!result) {
			throw new ResourceDoesNotExistError('Shopping list does not exist.');
		}
		return result;
	} catch (error) {
		console.error({
			message: 'Get shopping list by Id',
			description: (error as Error).message,
			shoppingListId,
		});
		throw error;
	}
};

/**
 * Add a new shopping list.
 * If another shopping list with the same name exists, an error is thrown.
 * @param {string} name - The name of the new shopping list.
 * @returns {Promise<WithId<ShoppingList>>} The newly created shopping list
 */
export const addNewShoppingList = async (
	name: string
): Promise<WithId<ShoppingList>> => {
	try {
		const shoppingLists = await findShoppingListsByName(name);
		if (shoppingLists.length > 0) {
			throw new DuplicationError(
				'Shopping list with the same name already exists.'
			);
		}
		return await insertNewShoppingList({
			name,
			items: [],
		});
	} catch (error) {
		console.error({
			message: 'Unable to add new shopping list',
			description: (error as Error).message,
			name,
		});
		throw error;
	}
};

/**
 * Update a shopping list by a given Id.
 * If there are shopping lists of the same name, an error is thrown.
 * If update is not successful, an error is thrown.
 * @param {string} id - The shopping list Id
 * @param {string} payload.name - The new name of the shopping list
 * @returns {Promise<WithId<ShoppingList>>} The updated shopping list
 */
export const updateShoppingList = async (
	id: string,
	payload: { name: string }
): Promise<WithId<ShoppingList>> => {
	try {
		const { name } = payload;
		const shoppingLists = await findShoppingListsByName(name);
		if (shoppingLists.length > 0) {
			throw new DuplicationError('Shopping list name already exists');
		}
		const result = await updateShoppingListById(id, payload);
		if (!result) {
			throw new UpdateError('Unable to update shopping list');
		}
		return result;
	} catch (error) {
		console.error({
			message: 'Unable to update shopping list',
			description: (error as Error).message,
			id,
			payload,
		});
		throw error;
	}
};

/**
 * Delete a shopping list by a given Id.
 * If deletion is not successful, an error is thrown.
 * @param {string} id - The shopping list Id
 * @param {string} payload.name - The new name of the shopping list
 * @returns {Promise<WithId<ShoppingList>>} The updated shopping list
 */
export const deleteShoppingList = async (
	id: string
): Promise<WithId<ShoppingList>> => {
	try {
		const result = await deleteShoppingListById(id);
		if (!result) {
			throw new ResourceDoesNotExistError('Unable to delete shopping list');
		}
		return result;
	} catch (error) {
		console.error({
			message: 'Unable to delete shopping list',
			description: (error as Error).message,
			id,
		});
		throw error;
	}
};

/**
 * Add a shopping item to the shopping list
 * If adding item to shopping list is not successful, an error is thrown
 * If the an item with the same name already exists, add the quantities together
 * @param {string} id - The shopping list Id
 * @param {ShoppingItem} item - The new shopping item
 * @returns {Promise<WithId<ShoppingItem>>} The updated shopping item
 */
export const addNewItemToShoppingList = async (
	id: string,
	item: ShoppingItem
): Promise<WithId<ShoppingItem>> => {
	try {
		const shoppingList = await findShoppingListById(id);
		if (!shoppingList) {
			throw new ResourceDoesNotExistError('Shopping list does not exist');
		}
		const sameItem = shoppingList.items.find((i) => i.name === item.name);
		let itemToUpdate: WithOptionalId<ShoppingItem> = {
			...item,
		};
		if (sameItem) {
			itemToUpdate = {
				...sameItem,
				...itemToUpdate,
				quantity: itemToUpdate.quantity + sameItem.quantity,
			};
		}
		const result = await addItemToShoppingList(id, itemToUpdate);
		if (!result) {
			throw new UpdateError('Unable to add item to shopping list');
		}
		return result;
	} catch (error) {
		console.error({
			message: 'Unable to delete shopping list',
			description: (error as Error).message,
			id,
		});
		throw error;
	}
};
