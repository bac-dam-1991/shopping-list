import { useHttpClient } from './client';
import { ShoppingItem, ShoppingList, WithId } from '@common/types';
import { useCallback } from 'react';

const ShoppingLists = 'shopping-lists';

export const useGetAllShoppingListsApi = () => {
	const { getClient } = useHttpClient();

	const getAllShoppingListsApi = useCallback(async () => {
		const client = await getClient();
		const response = await client.get<WithId<ShoppingList>[]>(ShoppingLists);
		return response.data;
	}, [getClient]);

	return { getAllShoppingListsApi };
};

export const useGetShoppingListByIdApi = () => {
	const { getClient } = useHttpClient();

	const getShoppingListByIdApi = useCallback(
		async (id: string): Promise<WithId<ShoppingList>> => {
			const client = await getClient();
			const response = await client.get<WithId<ShoppingList>>(
				`${ShoppingLists}/${id}`
			);
			return response.data;
		},
		[getClient]
	);

	return { getShoppingListByIdApi };
};

export const useAddNewShoppingListApi = () => {
	const { getClient } = useHttpClient();

	const addNewShoppingListApi = useCallback(
		async (payload: { name: string }): Promise<WithId<ShoppingList>> => {
			const client = await getClient();
			const response = await client.post<WithId<ShoppingList>>(
				`${ShoppingLists}`,
				payload
			);
			return response.data;
		},
		[getClient]
	);

	return { addNewShoppingListApi };
};

export const useDeleteShoppingListApi = () => {
	const { getClient } = useHttpClient();

	const deleteShoppingListApi = async (
		id: string
	): Promise<WithId<ShoppingList>> => {
		const client = await getClient();
		const response = await client.delete<WithId<ShoppingList>>(
			`${ShoppingLists}/${id}`
		);
		return response.data;
	};

	return { deleteShoppingListApi };
};

export const useUpdateShoppingListApi = () => {
	const { getClient } = useHttpClient();

	const updateShoppingListApi = useCallback(
		async (
			id: string,
			payload: { name: string }
		): Promise<WithId<ShoppingList>> => {
			const client = await getClient();
			const response = await client.put<WithId<ShoppingList>>(
				`${ShoppingLists}/${id}`,
				payload
			);
			return response.data;
		},
		[getClient]
	);

	return { updateShoppingListApi };
};

export const useAddItemToShoppingListApi = () => {
	const { getClient } = useHttpClient();

	const addItemToShoppingListApi = useCallback(
		async (
			id: string,
			payload: { name: string; unit: string; quantity: number }
		) => {
			const client = await getClient();
			const response = await client.post(`${ShoppingLists}/${id}/items/add`, {
				...payload,
				status: 'New',
			});
			return response.data;
		},
		[getClient]
	);

	return { addItemToShoppingListApi };
};

export const useUpdateShoppingItemApi = () => {
	const { getClient } = useHttpClient();

	const updateShoppingItemApi = useCallback(
		async (id: string, payload: WithId<ShoppingItem>) => {
			const client = await getClient();
			const response = await client.put(
				`${ShoppingLists}/${id}/items/${payload.id}/update`,
				payload
			);
			return response.data;
		},
		[getClient]
	);

	return { updateShoppingItemApi };
};

export const useRemoveShoppingItemApi = () => {
	const { getClient } = useHttpClient();

	const removeShoppingItemApi = useCallback(
		async (id: string, itemId: string) => {
			const client = await getClient();
			const response = await client.put(
				`${ShoppingLists}/${id}/items/${itemId}/delete`,
				{}
			);
			return response.data;
		},
		[getClient]
	);

	return { removeShoppingItemApi };
};
