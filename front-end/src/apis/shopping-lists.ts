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

export const addNewShoppingListApi = async (payload: {
	name: string;
}): Promise<ShoppingList> => {
	const response = await Client.post<ShoppingList>(`${ShoppingLists}`, payload);
	return response.data;
};

export const deleteShoppingListApi = async (
	id: string
): Promise<ShoppingList> => {
	const response = await Client.delete<ShoppingList>(`${ShoppingLists}/${id}`);
	return response.data;
};
