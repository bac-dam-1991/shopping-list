import { ObjectId } from 'mongodb';
import { find, findOne, insertOne, WithId } from './adapters/mongo';

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
	items: ShoppingItem[];
}

export const findAllShoppingLists = async (): Promise<
	WithId<ShoppingList>[]
> => {
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
 * @returns {Promise<WithId<ShoppingList> | null>} The shopping list or `null`
 */
export const findShoppingListById = async (
	shoppingListId: string
): Promise<WithId<ShoppingList> | null> => {
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

/**
 * Add a new shopping list
 * @param {ShoppingList} payload - The shopping list payload
 * @returns {Promise<WithId<ShoppingList>>} The newly created shopping list
 */
export const insertNewShoppingList = async (
	payload: ShoppingList
): Promise<WithId<ShoppingList>> => {
	try {
		return await insertOne<ShoppingList>(ShoppingListCollection, payload);
	} catch (error) {
		console.error({
			message: 'Unable to add new shopping list',
			description: (error as Error).message,
			payload,
		});
		throw error;
	}
};

/**
 * Find shopping lists with the same name
 * @param {string} name - The shopping list name
 * @returns {Promise<WithId<ShoppingList>[]>} The array of shopping lists with the same name
 */
export const findShoppingListByName = async (
	name: string
): Promise<WithId<ShoppingList>[]> => {
	try {
		return await find<ShoppingList>(ShoppingListCollection, { name });
	} catch (error) {
		console.error({
			message: 'Unable to find shopping list by name',
			description: (error as Error).message,
			name,
		});
		throw error;
	}
};
