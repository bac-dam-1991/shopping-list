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

export const updateShoppingListApi = async (
	id: string,
	payload: { name: string }
): Promise<ShoppingList> => {
	const response = await Client.put<ShoppingList>(
		`${ShoppingLists}/${id}`,
		payload
	);
	return response.data;
};

export const addItemToShoppingListApi = async (
	id: string,
	payload: { name: string; unit: string; quantity: number }
) => {
	const response = await Client.post(`${ShoppingLists}/${id}/items/add`, {
		...payload,
		status: 'New',
	});
	return response.data;
};
