import { DuplicationError } from '../custom-errors/DuplicationError';
import { ResourceDoesNotExistError } from '../custom-errors/ResourceDoesNotExistError';
import { UpdateError } from '../custom-errors/UpdateError';
import { updateOne, WithId } from '../repositories/adapters/mongo';
import {
	ShoppingList,
	findShoppingListById,
	insertNewShoppingList,
	findShoppingListsByName as findShoppingListsByName,
	updateShoppingListById,
	deleteShoppingListById,
	ShoppingItem,
	addItemToShoppingList,
	updateItemInShoppingList,
	getItemInShoppingList,
	pullItemFromShoppingList,
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
 * @param {string} shoppingListId - The shopping list Id
 * @param {ShoppingItem} item - The new shopping item
 * @returns {Promise<WithId<ShoppingItem>>} The updated shopping item
 */
export const addNewItemToShoppingList = async (
	shoppingListId: string,
	item: ShoppingItem
): Promise<WithId<ShoppingItem>> => {
	try {
		const shoppingList = await findShoppingListById(shoppingListId);
		if (!shoppingList) {
			throw new ResourceDoesNotExistError('Shopping list does not exist');
		}
		const sameItem = shoppingList.items.find((i) => i.name === item.name);
		let result: null | WithId<ShoppingItem> = null;
		if (sameItem) {
			const itemToUpdate: WithId<ShoppingItem> = {
				...sameItem,
				...item,
				quantity: item.quantity + sameItem.quantity,
			};
			result = await updateItemInShoppingList(shoppingListId, itemToUpdate);
		} else {
			result = await addItemToShoppingList(shoppingListId, item);
		}
		if (!result) {
			throw new UpdateError('Unable to add item to shopping list');
		}
		return result;
	} catch (error) {
		console.error({
			message: 'Unable to add item to shopping list',
			description: (error as Error).message,
			shoppingListId,
			item,
		});
		throw error;
	}
};

/**
 * Update item in shopping list
 * An error is thrown is item cannot be found in shopping list
 * @param {string} shoppingListId - The shopping list Id
 * @param {WithId<Partial<ShoppingItem>>} item - The new values for the shopping item
 * @returns {Promise<WithId<ShoppingItem>>} The updated item
 */
export const updateShoppingItem = async (
	shoppingListId: string,
	item: WithId<Partial<ShoppingItem>>
): Promise<WithId<ShoppingItem>> => {
	try {
		const { id, quantity, name, unit, status } = item;
		const shoppingItem = await getItemInShoppingList({
			shoppingListId,
			itemId: id,
		});
		if (!shoppingItem) {
			throw new ResourceDoesNotExistError(
				'Item does not exist in shopping list'
			);
		}
		const itemToUpdate = {
			id,
			name: name || shoppingItem.name,
			quantity: quantity || shoppingItem.quantity,
			status: status || shoppingItem.status,
			unit: unit || shoppingItem.unit,
		};
		const result = await updateItemInShoppingList(shoppingListId, itemToUpdate);
		if (!result) {
			throw new UpdateError('Unable to update item');
		}
		return result;
	} catch (error) {
		console.error({
			message: 'Unable to update item in shopping list',
			description: (error as Error).message,
			shoppingListId,
			item,
		});
		throw error;
	}
};

/**
 * Remove item from shopping list
 * It checks if the item exists in the shopping list.
 * If the item exists, then it is removed.
 * Else an error is thrown.
 * @param {string} shoppingListId - The shopping list Id
 * @param {string} itemId - The item Id
 * @returns {Promise<WithId<ShoppingItem>>} The shopping item if successfully removed.
 */
export const removeItemFromShoppingList = async (
	shoppingListId: string,
	itemId: string
): Promise<WithId<ShoppingItem>> => {
	try {
		const shoppingItem = await getItemInShoppingList({
			shoppingListId,
			itemId,
		});
		if (!shoppingItem) {
			throw new ResourceDoesNotExistError(
				'Item does not exist in shopping list'
			);
		}
		const result = await pullItemFromShoppingList(shoppingListId, shoppingItem);
		if (!result) {
			throw new UpdateError('Unable to update item');
		}
		return result;
	} catch (error) {
		console.error({
			message: 'Unable to remove item from shopping list',
			description: (error as Error).message,
			shoppingListId,
			itemId,
		});
		throw error;
	}
};
