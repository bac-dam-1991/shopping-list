import { ObjectId } from 'mongodb';
import { find, findOne } from './adapters/mongo';

const ShoppingListCollection = 'shopping-lists';

export interface ShoppingItem {
	id: string;
	name: string;
	unit: string;
	quantity: number;
	status: string;
}

export interface ShoppingList {
	name: string;
	id: string;
	items: ShoppingItem[];
}

export const findAllShoppingLists = async (): Promise<ShoppingList[]> => {
	try {
		return await find<ShoppingList>(ShoppingListCollection);
	} catch (error) {
		console.error({
			message: 'Unable to find all shopping lists',
			description: (error as Error).message,
		});
		throw error;
	}
};

/**
 * Get shopping list by Id.
 * @param {string} shoppingListId - The shopping list Id
 * @returns {Promise<ShoppingList | null>} The shopping list or `null`
 */
export const findShoppingListById = async (
	shoppingListId: string
): Promise<ShoppingList | null> => {
	try {
		return await findOne<ShoppingList>(ShoppingListCollection, {
			_id: new ObjectId(shoppingListId),
		});
	} catch (error) {
		console.error({
			message: 'Unable to find shopping list by Id',
			description: (error as Error).message,
			shoppingListId,
		});
		throw error;
	}
};
