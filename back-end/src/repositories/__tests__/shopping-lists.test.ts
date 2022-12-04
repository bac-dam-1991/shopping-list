const mockedFind = jest.fn();
const mockedFindOne = jest.fn();
const mockedInsertOne = jest.fn();
const mockedFindOneAndUpdate = jest.fn();
const mockedFindOneAndDelete = jest.fn();
const mockedUpdateOne = jest.fn();
const mockedAggregate = jest.fn();
jest.mock('../adapters/mongo', () => {
	return {
		find: mockedFind,
		findOne: mockedFindOne,
		insertOne: mockedInsertOne,
		findOneAndUpdate: mockedFindOneAndUpdate,
		findOneAndDelete: mockedFindOneAndDelete,
		updateOne: mockedUpdateOne,
		aggregate: mockedAggregate,
	};
});

import {
	addItemToShoppingList,
	deleteShoppingListById,
	findAllShoppingLists,
	findShoppingListById,
	findShoppingListsByName,
	getItemInShoppingList,
	insertNewShoppingList,
	pullItemFromShoppingList,
	updateItemInShoppingList,
	updateShoppingListById,
} from '../shopping-lists';
import { mockedError } from '../../../jest/setupTests';
import { ObjectId } from 'mongodb';
import { ShoppingItem, WithId } from '../../../../common/types';

describe('shopping lists repository functions', () => {
	describe('findAllShoppingLists', () => {
		const mockedResult = [
			{
				name: 'Fruits and Vegs',
				items: [],
				id: '63552a5d00ca2e59a40c1f53',
			},
		];
		const sub = 'sub';
		it('throws error from find', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			await expect(findAllShoppingLists(sub)).rejects.toThrowError('boom');
		});
		it('throws error from find', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			try {
				await findAllShoppingLists(sub);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to find all shopping lists',
				description: 'boom',
			});
		});
		it('calls find with correct payload', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			try {
				await findAllShoppingLists(sub);
			} catch {}
			expect(mockedFind).toHaveBeenCalledWith('shopping-lists');
		});
		it('returns the correct result', async () => {
			mockedFind.mockResolvedValueOnce(mockedResult);
			const result = await findAllShoppingLists(sub);
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
			sub: 'sub',
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
		const sub = 'sub';
		it('throws error from find', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			await expect(findShoppingListsByName({ name, sub })).rejects.toThrowError(
				'boom'
			);
		});
		it('logs error from find', async () => {
			mockedFind.mockRejectedValueOnce(new Error('boom'));
			try {
				await findShoppingListsByName({ name, sub });
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
				await findShoppingListsByName({ name, sub });
			} catch {}
			expect(mockedFind).toHaveBeenCalledWith('shopping-lists', { name });
		});
		it('returns the correct result', async () => {
			mockedFind.mockResolvedValueOnce([
				{ id: '635a732b98ca699215c94708', name: 'Fruits and Vegs', items: [] },
			]);
			const result = await findShoppingListsByName({ name, sub });
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

	describe('getItemInShoppingList', () => {
		const shoppingListId = '635a732b98ca699215c94708';
		const itemId = '635e68f7da7f6722c6441104';
		it('throws error from aggregate', async () => {
			mockedAggregate.mockRejectedValueOnce(new Error('boom'));
			await expect(
				getItemInShoppingList({ shoppingListId, itemId })
			).rejects.toThrowError('boom');
		});
		it('logs error from aggregate', async () => {
			mockedAggregate.mockRejectedValueOnce(new Error('boom'));
			try {
				await getItemInShoppingList({ shoppingListId, itemId });
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to get item in shopping list',
				description: 'boom',
				payload: { shoppingListId, itemId },
			});
		});
		+it('logs error from aggregate', async () => {
			mockedAggregate.mockRejectedValueOnce(new Error('boom'));
			try {
				await getItemInShoppingList({ shoppingListId, itemId });
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to get item in shopping list',
				description: 'boom',
				payload: { shoppingListId, itemId },
			});
		});
		it('calls aggregate with correct payload', async () => {
			mockedAggregate.mockRejectedValueOnce(new Error('boom'));
			try {
				await getItemInShoppingList({ shoppingListId, itemId });
			} catch {}
			expect(mockedAggregate).toHaveBeenCalledWith('shopping-lists', [
				{
					$match: {
						_id: new ObjectId(shoppingListId),
					},
				},
				{
					$unwind: {
						path: '$items',
						preserveNullAndEmptyArrays: false,
					},
				},
				{
					$replaceRoot: {
						newRoot: '$items',
					},
				},
				{
					$match: {
						id: itemId,
					},
				},
			]);
		});
		it('returns null because there is no matching item in shopping list', async () => {
			mockedAggregate.mockResolvedValueOnce([]);
			const result = await getItemInShoppingList({ shoppingListId, itemId });
			expect(result).toBeNull();
		});
		it('returns matching item in shopping list', async () => {
			const shoppingItem: WithId<ShoppingItem> = {
				id: '635e68f7da7f6722c6441104',
				name: 'Test Item',
				quantity: 1,
				unit: 'test',
				status: 'New',
			};
			mockedAggregate.mockResolvedValueOnce([shoppingItem]);
			const result = await getItemInShoppingList({ shoppingListId, itemId });
			expect(result).toStrictEqual(shoppingItem);
		});
	});

	describe('pullItemFromShoppingList', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const shoppingItem = {
			id: '635c712a6ad5ada00ab564dc',
			name: 'bananas',
			status: 'New',
			quantity: 8,
			unit: 'piece',
		};
		it('throws error from updateOne', async () => {
			mockedUpdateOne.mockRejectedValueOnce(new Error('boom'));
			await expect(
				pullItemFromShoppingList(shoppingListId, shoppingItem)
			).rejects.toThrowError('boom');
		});
		it('logs error from updateOne', async () => {
			mockedUpdateOne.mockRejectedValueOnce(new Error('boom'));
			try {
				await pullItemFromShoppingList(shoppingListId, shoppingItem);
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
				await pullItemFromShoppingList(shoppingListId, shoppingItem);
			} catch {}
			expect(mockedUpdateOne).toHaveBeenCalledWith(
				'shopping-lists',
				{
					_id: new ObjectId(shoppingListId),
				},
				{
					$pull: {
						items: shoppingItem,
					},
				}
			);
		});
		it('returns null because result is false', async () => {
			mockedUpdateOne.mockResolvedValueOnce(false);
			const result = await pullItemFromShoppingList(
				shoppingListId,
				shoppingItem
			);
			expect(result).toBeNull();
		});
		it('returns shopping item because result is true', async () => {
			mockedUpdateOne.mockResolvedValueOnce(true);
			const result = await pullItemFromShoppingList(
				shoppingListId,
				shoppingItem
			);
			expect(result).toStrictEqual(shoppingItem);
		});
	});

	describe('pullItemFromShoppingList', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const shoppingItem: WithId<ShoppingItem> = {
			id: '635c712a6ad5ada00ab564dc',
			name: 'Apples',
			quantity: 1,
			status: 'New',
			unit: 'piece',
		};
		it('throws error from updateOne', async () => {
			mockedUpdateOne.mockRejectedValueOnce(new Error('boom'));
			await expect(
				pullItemFromShoppingList(shoppingListId, shoppingItem)
			).rejects.toThrowError('boom');
		});
		it('logs error from updateOne', async () => {
			mockedUpdateOne.mockRejectedValueOnce(new Error('boom'));
			try {
				await pullItemFromShoppingList(shoppingListId, shoppingItem);
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
				await pullItemFromShoppingList(shoppingListId, shoppingItem);
			} catch {}
			expect(mockedUpdateOne).toHaveBeenCalledWith(
				'shopping-lists',
				{
					_id: new ObjectId(shoppingListId),
				},
				{
					$pull: {
						items: shoppingItem,
					},
				}
			);
		});
		it('returns null because result is false', async () => {
			mockedUpdateOne.mockResolvedValueOnce(false);
			const result = await pullItemFromShoppingList(
				shoppingListId,
				shoppingItem
			);
			expect(result).toBeNull();
		});
		it('returns deleted shopping item because result is true', async () => {
			mockedUpdateOne.mockResolvedValueOnce(true);
			const result = await pullItemFromShoppingList(
				shoppingListId,
				shoppingItem
			);
			expect(result).toStrictEqual(shoppingItem);
		});
	});
});
