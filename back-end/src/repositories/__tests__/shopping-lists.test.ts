const mockedFind = jest.fn();
const mockedFindOne = jest.fn();
const mockedInsertOne = jest.fn();
const mockedFindOneAndUpdate = jest.fn();
const mockedFindOneAndDelete = jest.fn();
const mockedUpdateOne = jest.fn();
jest.mock('../adapters/mongo', () => {
	return {
		find: mockedFind,
		findOne: mockedFindOne,
		insertOne: mockedInsertOne,
		findOneAndUpdate: mockedFindOneAndUpdate,
		findOneAndDelete: mockedFindOneAndDelete,
		updateOne: mockedUpdateOne,
	};
});

import {
	addItemToShoppingList,
	deleteShoppingListById,
	findAllShoppingLists,
	findShoppingListById,
	findShoppingListsByName,
	insertNewShoppingList,
	ShoppingItem,
	updateItemInShoppingList,
	updateShoppingListById,
} from '../shopping-lists';
import { mockedError } from '../../../jest/setupTests';
import { ObjectId } from 'mongodb';
import { WithId } from '../adapters/mongo';

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

	describe('addItemToShoppingList', () => {
		const shoppingListId = '635a732b98ca699215c94708';
		const item: ShoppingItem = {
			name: 'Test Item',
			quantity: 1,
			unit: 'test',
			status: 'New',
		};
		it('throws error from updateOne', async () => {
			mockedUpdateOne.mockRejectedValueOnce(new Error('boom'));
			await expect(
				addItemToShoppingList(shoppingListId, item)
			).rejects.toThrowError('boom');
		});
		it('logs error from updateOne', async () => {
			mockedUpdateOne.mockRejectedValueOnce(new Error('boom'));
			try {
				await addItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add item to shopping list',
				description: 'boom',
				shoppingListId,
				item,
			});
		});
		it('calls updateOne with correct payload', async () => {
			mockedUpdateOne.mockRejectedValueOnce(new Error('boom'));
			try {
				await addItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedUpdateOne).toHaveBeenCalledWith(
				'shopping-lists',
				{
					_id: new ObjectId(shoppingListId),
				},
				{ $push: { items: expect.objectContaining(item) } }
			);
		});
		it('returns null because result is false', async () => {
			mockedUpdateOne.mockResolvedValueOnce(false);
			const result = await addItemToShoppingList(shoppingListId, item);
			expect(result).toBeNull();
		});
		it('returns newly added shopping item', async () => {
			mockedUpdateOne.mockResolvedValueOnce(true);
			const result = await addItemToShoppingList(shoppingListId, item);
			expect(result).toStrictEqual(expect.objectContaining(item));
		});
	});

	describe('updateItemInShoppingList', () => {
		const shoppingListId = '635a732b98ca699215c94708';
		const shoppingItem: WithId<ShoppingItem> = {
			id: '635e68f7da7f6722c6441104',
			name: 'Test Item',
			quantity: 1,
			unit: 'test',
			status: 'New',
		};
		it('throws error from updateOne', async () => {
			mockedUpdateOne.mockRejectedValueOnce(new Error('boom'));
			await expect(
				updateItemInShoppingList(shoppingListId, shoppingItem)
			).rejects.toThrowError('boom');
		});
		it('logs error from updateOne', async () => {
			mockedUpdateOne.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateItemInShoppingList(shoppingListId, shoppingItem);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to update item in shopping list',
				description: 'boom',
				shoppingListId,
				shoppingItem,
			});
		});
		it('calls updateOne with correct payload', async () => {
			mockedUpdateOne.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateItemInShoppingList(shoppingListId, shoppingItem);
			} catch {}
			expect(mockedUpdateOne).toHaveBeenCalledWith(
				'shopping-lists',
				{
					_id: new ObjectId(shoppingListId),
					'items.id': shoppingItem.id,
				},
				{
					$set: {
						'items.$': {
							...shoppingItem,
						},
					},
				}
			);
		});
		it('returns null because result is false', async () => {
			mockedUpdateOne.mockResolvedValueOnce(false);
			const result = await updateItemInShoppingList(
				shoppingListId,
				shoppingItem
			);
			expect(result).toBeNull();
		});
		it('returns newly added shopping item', async () => {
			mockedUpdateOne.mockResolvedValueOnce(true);
			const result = await updateItemInShoppingList(
				shoppingListId,
				shoppingItem
			);
			expect(result).toStrictEqual(shoppingItem);
		});
	});
});
