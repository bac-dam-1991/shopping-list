import { DuplicationError } from '../custom-errors/DuplicationError';
import { ResourceDoesNotExistError } from '../custom-errors/ResourceDoesNotExistError';
import { UpdateError } from '../custom-errors/UpdateError';
import { WithId } from '../repositories/adapters/mongo';
import {
	ShoppingList,
	findShoppingListById,
	insertNewShoppingList,
	findShoppingListsByName as findShoppingListsByName,
	updateShoppingListById,
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
