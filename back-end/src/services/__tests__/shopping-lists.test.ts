const mockedFindShoppingListById = jest.fn();
jest.mock('../../repositories/shopping-lists', () => {
	return {
		findShoppingListById: mockedFindShoppingListById,
	};
});

import { mockedError } from '../../../jest/setupTests';
import { getShoppingListById } from '../shopping-lists';

describe('Shopping lists service functions', () => {
	describe('getShoppingListById', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const shoppingList = {
			id: '63552a5d00ca2e59a40c1f53',
			name: 'Fruits and Vegs',
			items: [],
		};
		it('throws error from findShoppingListById', async () => {
			mockedFindShoppingListById.mockRejectedValueOnce(new Error('boom'));
			await expect(getShoppingListById(shoppingListId)).rejects.toThrowError(
				'boom'
			);
		});
		it('logs error from findShoppingListById', async () => {
			mockedFindShoppingListById.mockRejectedValueOnce(new Error('boom'));
			try {
				await getShoppingListById(shoppingListId);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Get shopping list by Id',
				description: 'boom',
				shoppingListId,
			});
		});
		it('calls findShoppingListById with correct payload', async () => {
			mockedFindShoppingListById.mockRejectedValueOnce(new Error('boom'));
			try {
				await getShoppingListById(shoppingListId);
			} catch {}
			expect(mockedFindShoppingListById).toHaveBeenCalledWith(shoppingListId);
		});
		it('throws error from findShoppingListById', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce(null);
			await expect(getShoppingListById(shoppingListId)).rejects.toThrowError(
				'Shopping list does not exist.'
			);
		});
		it('logs error from findShoppingListById', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce(null);
			try {
				await getShoppingListById(shoppingListId);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Get shopping list by Id',
				description: 'Shopping list does not exist.',
				shoppingListId,
			});
		});
		it('returns a shopping list', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce(shoppingList);
			const result = await getShoppingListById(shoppingListId);
			expect(result).toStrictEqual(shoppingList);
		});
	});
});
