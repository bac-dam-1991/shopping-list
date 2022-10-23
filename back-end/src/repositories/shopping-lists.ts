import { find } from './adapters/mongo';

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
