import { ResourceDoesNotExistError } from '../custom-errors/ResourceDoesNotExistError';
import {
	ShoppingList,
	findShoppingListById,
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
