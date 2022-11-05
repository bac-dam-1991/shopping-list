import { ObjectId } from 'mongodb';
import {
	find,
	findOne,
	findOneAndDelete,
	findOneAndUpdate,
	insertOne,
	updateOne,
	WithId,
} from './adapters/mongo';

const ShoppingListCollection = 'shopping-lists';

export interface ShoppingItem {
	name: string;
	unit: string;
	quantity: number;
	status: string;
}

export interface ShoppingList {
	name: string;
	items: WithId<ShoppingItem>[];
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
export const findShoppingListsByName = async (
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

/**
 * Update shopping list by Id
 * @param {string} id - The shopping list Id
 * @param {string} payload.name - The new name of the shopping list
 * @returns {Promise<false | WithId<ShoppingList>>} The shopping list before update or false
 */
export const updateShoppingListById = async (
	id: string,
	payload: { name: string }
): Promise<false | WithId<ShoppingList>> => {
	try {
		const { name } = payload;
		return await findOneAndUpdate<ShoppingList>(
			ShoppingListCollection,
			{ _id: new ObjectId(id) },
			{ $set: { name } }
		);
	} catch (error) {
		console.error({
			message: 'Unable to update shopping list by Id',
			description: (error as Error).message,
			id,
			payload,
		});
		throw error;
	}
};

/**
 * Delete shopping list by Id
 * @param {string} id - The shopping list Id
 * @returns {Promise<false | WithId<ShoppingList>>} The shopping list before deletion or false
 */
export const deleteShoppingListById = async (
	id: string
): Promise<false | WithId<ShoppingList>> => {
	try {
		return await findOneAndDelete<ShoppingList>(ShoppingListCollection, {
			_id: new ObjectId(id),
		});
	} catch (error) {
		console.error({
			message: 'Unable to delete shopping list by Id',
			description: (error as Error).message,
			id,
		});
		throw error;
	}
};

/**
 * Add item to shopping list
 * @param {string} shoppingListId - The shopping list Id
 * @param {ShoppingItem} item - The new shopping item
 * @returns {Promise<null | WithId<ShoppingItem>>} The newly added shopping item or null
 */
export const addItemToShoppingList = async (
	shoppingListId: string,
	item: ShoppingItem
): Promise<null | WithId<ShoppingItem>> => {
	try {
		const itemId = new ObjectId().toString();
		const newItem: WithId<ShoppingItem> = {
			id: itemId,
			...item,
		};
		const result = await updateOne(
			ShoppingListCollection,
			{
				_id: new ObjectId(shoppingListId),
			},
			{ $push: { items: newItem } }
		);
		if (!result) {
			return null;
		}
		return newItem;
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
 * Update an existing item in the provided shopping list
 * @param {string} shoppingListId - The Id of the shopping list
 * @param {WithId<ShoppingItem>} shoppingItem - The shopping item to update
 * @returns {Promise<WithId<ShoppingItem> | null>} The updated shopping item
 */
export const updateItemInShoppingList = async (
	shoppingListId: string,
	shoppingItem: WithId<ShoppingItem>
): Promise<WithId<ShoppingItem> | null> => {
	try {
		const result = await updateOne(
			ShoppingListCollection,
			{
				_id: new ObjectId(shoppingListId),
				'items.id': shoppingItem.id,
			},
			{
				$set: {
					'items.$': {
						...shoppingItem,
					},
				},
			}
		);
		if (!result) {
			return null;
		}
		return shoppingItem;
	} catch (error) {
		console.error({
			message: 'Unable to update item in shopping list',
			description: (error as Error).message,
			shoppingListId,
			shoppingItem,
		});
		throw error;
	}
};
