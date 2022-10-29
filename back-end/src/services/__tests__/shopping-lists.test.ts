const mockedFindShoppingListById = jest.fn();
const mockedFindShoppingListsByName = jest.fn();
const mockedInsertNewShoppingList = jest.fn();
const mockedUpdateShoppingListById = jest.fn();
jest.mock('../../repositories/shopping-lists', () => {
	return {
		findShoppingListById: mockedFindShoppingListById,
		findShoppingListsByName: mockedFindShoppingListsByName,
		insertNewShoppingList: mockedInsertNewShoppingList,
		updateShoppingListById: mockedUpdateShoppingListById,
	};
});

import { mockedError } from '../../../jest/setupTests';
import {
	addNewShoppingList,
	getShoppingListById,
	updateShoppingList,
} from '../shopping-lists';

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
		it('throws error from findShoppingListsByName', async () => {
			mockedFindShoppingListsByName.mockRejectedValueOnce(new Error('boom'));
			await expect(addNewShoppingList(name)).rejects.toThrowError('boom');
		});
		it('logs error from findShoppingListsByName', async () => {
			mockedFindShoppingListsByName.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewShoppingList(name);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add new shopping list',
				description: 'boom',
				name,
			});
		});
		it('calls findShoppingListsByName with correct payload', async () => {
			mockedFindShoppingListsByName.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewShoppingList(name);
			} catch {}
			expect(mockedFindShoppingListsByName).toHaveBeenCalledWith(name);
		});
		it('throws error from findShoppingListsByName because there is a shopping list with the same name', async () => {
			mockedFindShoppingListsByName.mockResolvedValueOnce([{ name }]);
			await expect(addNewShoppingList(name)).rejects.toThrowError(
				'Shopping list with the same name already exists.'
			);
		});
		it('logs error from findShoppingListsByName because there is a shopping list with the same name', async () => {
			mockedFindShoppingListsByName.mockResolvedValueOnce([{ name }]);
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
			mockedFindShoppingListsByName.mockResolvedValueOnce([]);
			mockedInsertNewShoppingList.mockRejectedValueOnce(new Error('boom'));
			await expect(addNewShoppingList(name)).rejects.toThrowError('boom');
		});
		it('logs error from insertNewShoppingList', async () => {
			mockedFindShoppingListsByName.mockResolvedValueOnce([]);
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
			mockedFindShoppingListsByName.mockResolvedValueOnce([]);
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
			mockedFindShoppingListsByName.mockResolvedValueOnce([]);
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

	describe('updateShoppingList', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const newName = 'New name';
		it('throws error from findShoppingListsByName', async () => {
			mockedFindShoppingListsByName.mockRejectedValueOnce(new Error('boom'));
			await expect(
				updateShoppingList(shoppingListId, { name: newName })
			).rejects.toThrowError('boom');
		});
		it('logs error from findShoppingListsByName', async () => {
			mockedFindShoppingListsByName.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateShoppingList(shoppingListId, { name: newName });
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to update shopping list',
				description: 'boom',
				id: shoppingListId,
				payload: { name: newName },
			});
		});
		it('calls findShoppingListsByName with correct payload', async () => {
			mockedFindShoppingListsByName.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateShoppingList(shoppingListId, { name: newName });
			} catch {}
			expect(mockedFindShoppingListsByName).toHaveBeenCalledWith(newName);
		});
		it('throws error because shopping list with the same name is found', async () => {
			mockedFindShoppingListsByName.mockResolvedValueOnce([
				{ id: '6357c355568d5d5ebde28573', name: 'New name', items: [] },
			]);
			await expect(
				updateShoppingList(shoppingListId, { name: newName })
			).rejects.toThrowError('Shopping list name already exists');
		});
		it('logs error because shopping list with the same name is found', async () => {
			mockedFindShoppingListsByName.mockResolvedValueOnce([
				{ id: '6357c355568d5d5ebde28573', name: 'New name', items: [] },
			]);
			try {
				await updateShoppingList(shoppingListId, { name: newName });
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to update shopping list',
				description: 'Shopping list name already exists',
				id: shoppingListId,
				payload: { name: newName },
			});
		});
		it('throws error from updateShoppingListById', async () => {
			mockedFindShoppingListsByName.mockResolvedValueOnce([]);
			mockedUpdateShoppingListById.mockRejectedValueOnce(new Error('boom'));
			await expect(
				updateShoppingList(shoppingListId, { name: newName })
			).rejects.toThrowError('boom');
		});
		it('logs error from updateShoppingListById', async () => {
			mockedFindShoppingListsByName.mockResolvedValueOnce([]);
			mockedUpdateShoppingListById.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateShoppingList(shoppingListId, { name: newName });
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to update shopping list',
				description: 'boom',
				id: shoppingListId,
				payload: { name: newName },
			});
		});
		it('calls updateShoppingListById with correct payload', async () => {
			mockedFindShoppingListsByName.mockResolvedValueOnce([]);
			mockedUpdateShoppingListById.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateShoppingList(shoppingListId, { name: newName });
			} catch {}
			expect(mockedUpdateShoppingListById).toHaveBeenCalledWith(
				shoppingListId,
				{ name: newName }
			);
		});
		it('throws error because result is false', async () => {
			mockedFindShoppingListsByName.mockResolvedValueOnce([]);
			mockedUpdateShoppingListById.mockResolvedValueOnce(false);
			await expect(
				updateShoppingList(shoppingListId, { name: newName })
			).rejects.toThrowError('Unable to update shopping list');
		});
		it('logs error because result is false', async () => {
			mockedFindShoppingListsByName.mockResolvedValueOnce([]);
			mockedUpdateShoppingListById.mockResolvedValueOnce(false);
			try {
				await updateShoppingList(shoppingListId, { name: newName });
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to update shopping list',
				description: 'Unable to update shopping list',
				id: shoppingListId,
				payload: { name: newName },
			});
		});
		it('returns the shopping list that was updated', async () => {
			mockedFindShoppingListsByName.mockResolvedValueOnce([]);
			mockedUpdateShoppingListById.mockResolvedValueOnce({
				name: 'Stationary',
				items: [],
				id: shoppingListId,
			});
			const result = await updateShoppingList(shoppingListId, {
				name: newName,
			});
			expect(result).toStrictEqual({
				name: 'Stationary',
				items: [],
				id: shoppingListId,
			});
		});
	});
});
