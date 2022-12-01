import { Client } from '.';
import { ShoppingItem, ShoppingList, WithId } from '@common/types';

const ShoppingLists = 'shopping-lists';

export const getAllShoppingListsApi = async (): Promise<
	WithId<ShoppingList>[]
> => {
	const response = await Client.get<WithId<ShoppingList>[]>(ShoppingLists);
	return response.data;
};

export const getShoppingListByIdApi = async (
	id: string
): Promise<WithId<ShoppingList>> => {
	const response = await Client.get<WithId<ShoppingList>>(
		`${ShoppingLists}/${id}`
	);
	return response.data;
};

export const addNewShoppingListApi = async (payload: {
	name: string;
}): Promise<WithId<ShoppingList>> => {
	const response = await Client.post<WithId<ShoppingList>>(
		`${ShoppingLists}`,
		payload
	);
	return response.data;
};

export const deleteShoppingListApi = async (
	id: string
): Promise<WithId<ShoppingList>> => {
	const response = await Client.delete<WithId<ShoppingList>>(
		`${ShoppingLists}/${id}`
	);
	return response.data;
};

export const updateShoppingListApi = async (
	id: string,
	payload: { name: string }
): Promise<WithId<ShoppingList>> => {
	const response = await Client.put<WithId<ShoppingList>>(
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
	payload: WithId<ShoppingItem>
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
