import { Client } from '.';

export interface ShoppingList {
	name: string;
	id: string;
}

const ShoppingLists = 'shopping-lists';

export const getAllShoppingListsApi = async (): Promise<ShoppingList[]> => {
	const response = await Client.get<ShoppingList[]>(ShoppingLists);
	return response.data;
};

export const getShoppingListByIdApi = async (
	id: string
): Promise<ShoppingList> => {
	const response = await Client.get<ShoppingList>(`${ShoppingLists}/${id}`);
	return response.data;
};
