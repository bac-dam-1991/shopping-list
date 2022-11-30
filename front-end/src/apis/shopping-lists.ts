import { Client } from '.';
import Joi from 'joi';

export const ShoppingListNameSchema = Joi.string()
	.min(3)
	.max(50)
	.required()
	.messages({
		'any.required': 'Shopping list name is required.',
		'string.min':
			'Shopping list name needs to be at least {#limit} characters long.',
		'string.max':
			'Shopping list name cannot be more than {#limit} characters long.',
		'string.empty': 'Shopping list name is required.',
	});

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

export const updateShoppingItemApi = async (
	id: string,
	payload: ShoppingItem
) => {
	const response = await Client.put(
		`${ShoppingLists}/${id}/items/${payload.id}/update`,
		payload
	);
	return response.data;
};

export const removeShoppingItemApi = async (id: string, itemId: string) => {
	const response = await Client.put(
		`${ShoppingLists}/${id}/items/${itemId}/delete`
	);
	return response.data;
};
