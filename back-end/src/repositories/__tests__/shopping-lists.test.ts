const mockedFind = jest.fn();
const mockedFindOne = jest.fn();
const mockedInsertOne = jest.fn();
jest.mock('../adapters/mongo', () => {
	return {
		find: mockedFind,
		findOne: mockedFindOne,
		insertOne: mockedInsertOne,
	};
});

import {
	findAllShoppingLists,
	findShoppingListById,
	findShoppingListByName,
	insertNewShoppingList,
} from '../shopping-lists';
import { mockedError } from '../../../jest/setupTests';
import { ObjectId } from 'mongodb';

describe('shopping lists repository functions', () => {
	describe('findAllShoppingLists', () => {
		const mockedResult = [
			{
				name: 'Fruits and Vegs',
				items: [],
				id: '63552a5d00ca2e59a40c1f53',
			},
		];
		it('throws error from find', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			await expect(findAllShoppingLists()).rejects.toThrowError('boom');
		});
		it('throws error from find', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			try {
				await findAllShoppingLists();
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to find all shopping lists',
				description: 'boom',
			});
		});
		it('calls find with correct payload', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			try {
				await findAllShoppingLists();
			} catch {}
			expect(mockedFind).toHaveBeenCalledWith('shopping-lists');
		});
		it('returns the correct result', async () => {
			mockedFind.mockResolvedValueOnce(mockedResult);
			const result = await findAllShoppingLists();
			expect(result).toStrictEqual(mockedResult);
		});
	});

	describe('findShoppingListById', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const mockedResult = {
			id: '63552a5d00ca2e59a40c1f53',
			name: 'Fruits and Vegs',
			items: [],
		};
		it('throws error from findOne', async () => {
			mockedFindOne.mockRejectedValueOnce(new Error('boom'));
			await expect(findShoppingListById(shoppingListId)).rejects.toThrowError(
				'boom'
			);
		});
		it('logs error from findOne', async () => {
			mockedFindOne.mockRejectedValueOnce(new Error('boom'));
			try {
				await findShoppingListById(shoppingListId);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to find shopping list by Id',
				description: 'boom',
				shoppingListId: '63552a5d00ca2e59a40c1f53',
			});
		});
		it('calls find with correct payload', async () => {
			mockedFindOne.mockRejectedValueOnce(new Error('boom'));
			try {
				await findShoppingListById(shoppingListId);
			} catch {}
			expect(mockedFindOne).toHaveBeenCalledWith('shopping-lists', {
				_id: new ObjectId(shoppingListId),
			});
		});
		it('returns the correct result', async () => {
			mockedFindOne.mockResolvedValueOnce(mockedResult);
			const result = await findShoppingListById(shoppingListId);
			expect(result).toStrictEqual(mockedResult);
		});
	});
	describe('insertNewShoppingList', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const payload = {
			name: 'Fruits and Vegs',
			items: [],
		};
		it('throws error from insertOne', async () => {
			mockedInsertOne.mockRejectedValueOnce(new Error('boom'));
			await expect(insertNewShoppingList(payload)).rejects.toThrowError('boom');
		});
		it('logs error from insertOne', async () => {
			mockedInsertOne.mockRejectedValueOnce(new Error('boom'));
			try {
				await insertNewShoppingList(payload);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add new shopping list',
				description: 'boom',
				payload,
			});
		});
		it('calls insertOne with correct payload', async () => {
			mockedInsertOne.mockRejectedValueOnce(new Error('boom'));
			try {
				await insertNewShoppingList(payload);
			} catch {}
			expect(mockedInsertOne).toHaveBeenCalledWith('shopping-lists', payload);
		});
		it('returns the correct result', async () => {
			mockedInsertOne.mockResolvedValueOnce({ id: shoppingListId, ...payload });
			const result = await insertNewShoppingList(payload);
			expect(result).toStrictEqual({ id: shoppingListId, ...payload });
		});
	});
	describe('findShoppingListByName', () => {
		const name = 'Fruits and Vegs';
		it('throws error from find', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			await expect(findShoppingListByName(name)).rejects.toThrowError('boom');
		});
		it('logs error from find', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			try {
				await findShoppingListByName(name);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to find shopping list by name',
				description: 'boom',
				name,
			});
		});
		it('calls find with correct payload', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			try {
				await findShoppingListByName(name);
			} catch {}
			expect(mockedFind).toHaveBeenCalledWith('shopping-lists', { name });
		});
		it('returns the correct result', async () => {
			mockedFind.mockResolvedValueOnce([
				{ id: '635a732b98ca699215c94708', name: 'Fruits and Vegs', items: [] },
			]);
			const result = await findShoppingListByName(name);
			expect(result).toStrictEqual([
				{ id: '635a732b98ca699215c94708', name: 'Fruits and Vegs', items: [] },
			]);
		});
	});
});
