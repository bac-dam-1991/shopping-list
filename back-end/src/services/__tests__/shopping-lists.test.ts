const mockedFindShoppingListById = jest.fn();
const mockedFindShoppingListByName = jest.fn();
const mockedInsertNewShoppingList = jest.fn();
jest.mock('../../repositories/shopping-lists', () => {
	return {
		findShoppingListById: mockedFindShoppingListById,
		findShoppingListByName: mockedFindShoppingListByName,
		insertNewShoppingList: mockedInsertNewShoppingList,
	};
});

import { mockedError } from '../../../jest/setupTests';
import { addNewShoppingList, getShoppingListById } from '../shopping-lists';

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

	describe('addNewShoppingList', () => {
		const name = 'Groceries';
		it('throws error from findShoppingListByName', async () => {
			mockedFindShoppingListByName.mockRejectedValueOnce(new Error('boom'));
			await expect(addNewShoppingList(name)).rejects.toThrowError('boom');
		});
		it('logs error from findShoppingListByName', async () => {
			mockedFindShoppingListByName.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewShoppingList(name);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add new shopping list',
				description: 'boom',
				name,
			});
		});
		it('calls findShoppingListByName with correct payload', async () => {
			mockedFindShoppingListByName.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewShoppingList(name);
			} catch {}
			expect(mockedFindShoppingListByName).toHaveBeenCalledWith(name);
		});
		it('throws error from findShoppingListByName because there is a shopping list with the same name', async () => {
			mockedFindShoppingListByName.mockResolvedValueOnce([{ name }]);
			await expect(addNewShoppingList(name)).rejects.toThrowError(
				'Shopping list with the same name already exists.'
			);
		});
		it('logs error from findShoppingListByName because there is a shopping list with the same name', async () => {
			mockedFindShoppingListByName.mockResolvedValueOnce([{ name }]);
			try {
				await addNewShoppingList(name);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add new shopping list',
				description: 'Shopping list with the same name already exists.',
				name,
			});
		});
		it('throws error from insertNewShoppingList', async () => {
			mockedFindShoppingListByName.mockResolvedValueOnce([]);
			mockedInsertNewShoppingList.mockRejectedValueOnce(new Error('boom'));
			await expect(addNewShoppingList(name)).rejects.toThrowError('boom');
		});
		it('logs error from insertNewShoppingList', async () => {
			mockedFindShoppingListByName.mockResolvedValueOnce([]);
			mockedInsertNewShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewShoppingList(name);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add new shopping list',
				description: 'boom',
				name,
			});
		});
		it('calls insertNewShoppingList with correct payload', async () => {
			mockedFindShoppingListByName.mockResolvedValueOnce([]);
			mockedInsertNewShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewShoppingList(name);
			} catch {}
			expect(mockedInsertNewShoppingList).toHaveBeenCalledWith({
				name,
				items: [],
			});
		});
		it('returns correct value', async () => {
			mockedFindShoppingListByName.mockResolvedValueOnce([]);
			mockedInsertNewShoppingList.mockResolvedValueOnce({
				id: '635a72d64ab70da3b2628549',
				name: 'Groceries',
				items: [],
			});
			const result = await addNewShoppingList(name);
			expect(result).toStrictEqual({
				id: '635a72d64ab70da3b2628549',
				name: 'Groceries',
				items: [],
			});
		});
	});
});
