const mockedFind = jest.fn();
const mockedFindOne = jest.fn();
const mockedInsertOne = jest.fn();
const mockedFindOneAndUpdate = jest.fn();
const mockedFindOneAndDelete = jest.fn();
jest.mock('../adapters/mongo', () => {
	return {
		find: mockedFind,
		findOne: mockedFindOne,
		insertOne: mockedInsertOne,
		findOneAndUpdate: mockedFindOneAndUpdate,
		findOneAndDelete: mockedFindOneAndDelete,
	};
});

import {
	deleteShoppingListById,
	findAllShoppingLists,
	findShoppingListById,
	findShoppingListsByName,
	insertNewShoppingList,
	updateShoppingListById,
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
	describe('findShoppingListsByName', () => {
		const name = 'Fruits and Vegs';
		it('throws error from find', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			await expect(findShoppingListsByName(name)).rejects.toThrowError('boom');
		});
		it('logs error from find', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			try {
				await findShoppingListsByName(name);
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
				await findShoppingListsByName(name);
			} catch {}
			expect(mockedFind).toHaveBeenCalledWith('shopping-lists', { name });
		});
		it('returns the correct result', async () => {
			mockedFind.mockResolvedValueOnce([
				{ id: '635a732b98ca699215c94708', name: 'Fruits and Vegs', items: [] },
			]);
			const result = await findShoppingListsByName(name);
			expect(result).toStrictEqual([
				{ id: '635a732b98ca699215c94708', name: 'Fruits and Vegs', items: [] },
			]);
		});
	});

	describe('updateShoppingListById', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		it('throws error from findOneAndUpdate', async () => {
			mockedFindOneAndUpdate.mockRejectedValueOnce(new Error('boom'));
			await expect(
				updateShoppingListById(shoppingListId, { name: 'New name' })
			).rejects.toThrowError('boom');
		});
		it('logs error from findOneAndUpdate', async () => {
			mockedFindOneAndUpdate.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateShoppingListById(shoppingListId, { name: 'New name' });
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to update shopping list by Id',
				description: 'boom',
				id: shoppingListId,
				payload: { name: 'New name' },
			});
		});
		it('calls findOneAndUpdate with correct payload', async () => {
			mockedFindOneAndUpdate.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateShoppingListById(shoppingListId, { name: 'New name' });
			} catch {}
			expect(mockedFindOneAndUpdate).toHaveBeenCalledWith(
				'shopping-lists',
				{
					_id: new ObjectId(shoppingListId),
				},
				{ $set: { name: 'New name' } }
			);
		});
		it('returns the correct value', async () => {
			mockedFindOneAndUpdate.mockResolvedValueOnce(false);
			const result = await updateShoppingListById(shoppingListId, {
				name: 'New name',
			});
			expect(result).toBe(result);
		});
	});

	describe('deleteShoppingListById', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		it('throws error from findOneAndDelete', async () => {
			mockedFindOneAndDelete.mockRejectedValueOnce(new Error('boom'));
			await expect(deleteShoppingListById(shoppingListId)).rejects.toThrowError(
				'boom'
			);
		});
		it('logs error from findOneAndDelete', async () => {
			mockedFindOneAndDelete.mockRejectedValueOnce(new Error('boom'));
			try {
				await deleteShoppingListById(shoppingListId);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to delete shopping list by Id',
				description: 'boom',
				id: shoppingListId,
			});
		});
		it('calls findOneAndDelete with correct payload', async () => {
			mockedFindOneAndDelete.mockRejectedValueOnce(new Error('boom'));
			try {
				await deleteShoppingListById(shoppingListId);
			} catch {}
			expect(mockedFindOneAndDelete).toHaveBeenCalledWith('shopping-lists', {
				_id: new ObjectId(shoppingListId),
			});
		});
		it('returns the correct value', async () => {
			mockedFindOneAndDelete.mockResolvedValueOnce(false);
			const result = await deleteShoppingListById(shoppingListId);
			expect(result).toBe(result);
		});
	});
});
