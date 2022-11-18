const mockedFindShoppingListById = jest.fn();
const mockedFindShoppingListsByName = jest.fn();
const mockedInsertNewShoppingList = jest.fn();
const mockedUpdateShoppingListById = jest.fn();
const mockedDeleteShoppingListById = jest.fn();
const mockedUpdateItemInShoppingList = jest.fn();
const mockedAddItemToShoppingList = jest.fn();
const mockedGetItemInShoppingList = jest.fn();
const mockedPullItemFromShoppingList = jest.fn();
jest.mock('../../repositories/shopping-lists', () => {
	return {
		findShoppingListById: mockedFindShoppingListById,
		findShoppingListsByName: mockedFindShoppingListsByName,
		insertNewShoppingList: mockedInsertNewShoppingList,
		updateShoppingListById: mockedUpdateShoppingListById,
		deleteShoppingListById: mockedDeleteShoppingListById,
		updateItemInShoppingList: mockedUpdateItemInShoppingList,
		addItemToShoppingList: mockedAddItemToShoppingList,
		getItemInShoppingList: mockedGetItemInShoppingList,
		pullItemFromShoppingList: mockedPullItemFromShoppingList,
	};
});

import { mockedError } from '../../../jest/setupTests';
import { WithId } from '../../repositories/adapters/mongo';
import { ShoppingItem } from '../../repositories/shopping-lists';
import {
	addNewItemToShoppingList,
	addNewShoppingList,
	deleteShoppingList,
	getShoppingListById,
	removeItemFromShoppingList,
	updateShoppingItem,
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

	describe('deleteShoppingList', () => {
		const shoppingListId = '635a72d64ab70da3b2628549';
		it('throws error from deleteShoppingListById', async () => {
			mockedDeleteShoppingListById.mockRejectedValueOnce(new Error('boom'));
			await expect(deleteShoppingList(shoppingListId)).rejects.toThrowError(
				'boom'
			);
		});
		it('logs error from deleteShoppingListById', async () => {
			mockedDeleteShoppingListById.mockRejectedValueOnce(new Error('boom'));
			try {
				await deleteShoppingList(shoppingListId);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to delete shopping list',
				description: 'boom',
				id: shoppingListId,
			});
		});
		it('calls deleteShoppingListById with correct payload', async () => {
			mockedDeleteShoppingListById.mockRejectedValueOnce(new Error('boom'));
			try {
				await deleteShoppingList(shoppingListId);
			} catch {}
			expect(mockedDeleteShoppingListById).toHaveBeenCalledWith(shoppingListId);
		});
		it('throws error because result is false', async () => {
			mockedDeleteShoppingListById.mockResolvedValueOnce(false);
			await expect(deleteShoppingList(shoppingListId)).rejects.toThrowError(
				'Unable to delete shopping list'
			);
		});
		it('logs error because result is false', async () => {
			mockedDeleteShoppingListById.mockResolvedValueOnce(false);
			try {
				await deleteShoppingList(shoppingListId);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to delete shopping list',
				description: 'Unable to delete shopping list',
				id: shoppingListId,
			});
		});
		it('returns deleted shopping list', async () => {
			mockedDeleteShoppingListById.mockResolvedValueOnce({
				name: 'Groceries',
				items: [],
				id: '635a72d64ab70da3b2628549',
			});
			const result = await deleteShoppingList(shoppingListId);
			expect(result).toStrictEqual({
				name: 'Groceries',
				items: [],
				id: '635a72d64ab70da3b2628549',
			});
		});
	});

	describe('addNewItemToShoppingList', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const item: ShoppingItem = {
			name: 'bananas',
			status: 'New',
			quantity: 1,
			unit: 'piece',
		};
		it('throws error from findShoppingListById', async () => {
			mockedFindShoppingListById.mockRejectedValueOnce(new Error('boom'));
			await expect(
				addNewItemToShoppingList(shoppingListId, item)
			).rejects.toThrowError('boom');
		});
		it('logs error from findShoppingListById', async () => {
			mockedFindShoppingListById.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add item to shopping list',
				description: 'boom',
				shoppingListId,
				item,
			});
		});
		it('calls findShoppingListById with correct payload', async () => {
			mockedFindShoppingListById.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedFindShoppingListById).toHaveBeenCalledWith(shoppingListId);
		});
		it('throws error because shopping list is null', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce(null);
			await expect(
				addNewItemToShoppingList(shoppingListId, item)
			).rejects.toThrowError('Shopping list does not exist');
		});
		it('logs error because shopping list is null', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce(null);
			try {
				await addNewItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add item to shopping list',
				description: 'Shopping list does not exist',
				shoppingListId,
				item,
			});
		});
		it('throws error from updateItemInShoppingList', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [{ id: '635c712a6ad5ada00ab564dc', ...item }],
			});
			mockedUpdateItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			await expect(
				addNewItemToShoppingList(shoppingListId, item)
			).rejects.toThrowError('boom');
		});
		it('logs error from updateItemInShoppingList', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [{ id: '635c712a6ad5ada00ab564dc', ...item }],
			});
			mockedUpdateItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add item to shopping list',
				description: 'boom',
				shoppingListId,
				item,
			});
		});
		it('calls updateItemInShoppingList with correct payload', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [{ id: '635c712a6ad5ada00ab564dc', ...item }],
			});
			mockedUpdateItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedUpdateItemInShoppingList).toHaveBeenCalledWith(
				shoppingListId,
				{ ...item, id: '635c712a6ad5ada00ab564dc', quantity: 2 }
			);
		});
		it('throws error because updateItemInShoppingList returns null', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [{ id: '635c712a6ad5ada00ab564dc', ...item }],
			});
			mockedUpdateItemInShoppingList.mockResolvedValueOnce(null);
			await expect(
				addNewItemToShoppingList(shoppingListId, item)
			).rejects.toThrowError('Unable to add item to shopping list');
		});
		it('logs error because updateItemInShoppingList returns null', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [{ id: '635c712a6ad5ada00ab564dc', ...item }],
			});
			mockedUpdateItemInShoppingList.mockResolvedValueOnce(null);
			try {
				await addNewItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add item to shopping list',
				description: 'Unable to add item to shopping list',
				shoppingListId,
				item,
			});
		});
		it('returns correct result from updateItemInShoppingList', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [{ id: '635c712a6ad5ada00ab564dc', ...item }],
			});
			mockedUpdateItemInShoppingList.mockResolvedValueOnce({
				id: '635c712a6ad5ada00ab564dc',
				...item,
				quantity: 2,
			});
			const result = await addNewItemToShoppingList(shoppingListId, item);
			expect(result).toStrictEqual({
				id: '635c712a6ad5ada00ab564dc',
				...item,
				quantity: 2,
			});
		});
		it('does not call addItemToShoppingList', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [{ id: '635c712a6ad5ada00ab564dc', ...item }],
			});
			mockedUpdateItemInShoppingList.mockResolvedValueOnce(null);
			try {
				await addNewItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedAddItemToShoppingList).not.toHaveBeenCalled();
		});
		it('throws error from addItemToShoppingList', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [],
			});
			mockedAddItemToShoppingList.mockRejectedValueOnce(new Error('boom'));
			await expect(
				addNewItemToShoppingList(shoppingListId, item)
			).rejects.toThrowError('boom');
		});
		it('logs error from addItemToShoppingList', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [],
			});
			mockedAddItemToShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add item to shopping list',
				description: 'boom',
				shoppingListId,
				item,
			});
		});
		it('calls addItemToShoppingList with correct payload', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [],
			});
			mockedAddItemToShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await addNewItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedAddItemToShoppingList).toHaveBeenCalledWith(
				shoppingListId,
				item
			);
		});
		it('throws error because addItemToShoppingList returns null', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [],
			});
			mockedAddItemToShoppingList.mockResolvedValueOnce(null);
			await expect(
				addNewItemToShoppingList(shoppingListId, item)
			).rejects.toThrowError('Unable to add item to shopping list');
		});
		it('logs error because addItemToShoppingList returns null', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [],
			});
			mockedAddItemToShoppingList.mockResolvedValueOnce(null);
			try {
				await addNewItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to add item to shopping list',
				description: 'Unable to add item to shopping list',
				shoppingListId,
				item,
			});
		});
		it('does not call updateItemInShoppingList', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [],
			});
			mockedAddItemToShoppingList.mockResolvedValueOnce(null);
			try {
				await addNewItemToShoppingList(shoppingListId, item);
			} catch {}
			expect(mockedUpdateItemInShoppingList).not.toHaveBeenCalled();
		});
		it('returns correct result from addItemToShoppingList', async () => {
			mockedFindShoppingListById.mockResolvedValueOnce({
				id: shoppingListId,
				items: [],
			});
			mockedAddItemToShoppingList.mockResolvedValueOnce({
				id: '635c712a6ad5ada00ab564dc',
				...item,
			});
			const result = await addNewItemToShoppingList(shoppingListId, item);
			expect(result).toStrictEqual({
				id: '635c712a6ad5ada00ab564dc',
				...item,
			});
		});
	});

	describe('updateShoppingItem', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const itemId = '635c712a6ad5ada00ab564dc';
		const item: WithId<ShoppingItem> = {
			id: itemId,
			name: 'Bananas',
			quantity: 1,
			status: 'New',
			unit: 'pieces',
		};
		it('throws error from getItemInShoppingList', async () => {
			mockedGetItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			await expect(
				updateShoppingItem(shoppingListId, { id: itemId, quantity: 2 })
			).rejects.toThrowError('boom');
		});

		it('logs error from getItemInShoppingList', async () => {
			mockedGetItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateShoppingItem(shoppingListId, { id: itemId, quantity: 2 });
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to update item in shopping list',
				description: 'boom',
				shoppingListId,
				item: { id: itemId, quantity: 2 },
			});
		});

		it('calls getItemInShoppingList with correct payload', async () => {
			mockedGetItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateShoppingItem(shoppingListId, { id: itemId, quantity: 2 });
			} catch {}
			expect(mockedGetItemInShoppingList).toHaveBeenCalledWith({
				shoppingListId,
				itemId: item.id,
			});
		});

		it('throws error because item does not exist in shopping list', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(null);
			await expect(
				updateShoppingItem(shoppingListId, { id: itemId, quantity: 2 })
			).rejects.toThrowError('Item does not exist in shopping list');
		});

		it('logs error because item does not exist in shopping list', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(null);
			try {
				await updateShoppingItem(shoppingListId, { id: itemId, quantity: 2 });
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to update item in shopping list',
				description: 'Item does not exist in shopping list',
				shoppingListId,
				item: { id: itemId, quantity: 2 },
			});
		});

		it('throws error from updateItemInShoppingList', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(item);
			mockedUpdateItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			await expect(
				updateShoppingItem(shoppingListId, { id: itemId, quantity: 2 })
			).rejects.toThrowError('boom');
		});

		it('logs error from updateItemInShoppingList', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(item);
			mockedUpdateItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateShoppingItem(shoppingListId, { id: itemId, quantity: 2 });
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to update item in shopping list',
				description: 'boom',
				shoppingListId,
				item: { id: itemId, quantity: 2 },
			});
		});

		it('calls updateItemInShoppingList with correct payload', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(item);
			mockedUpdateItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await updateShoppingItem(shoppingListId, { id: itemId, quantity: 2 });
			} catch {}
			expect(mockedUpdateItemInShoppingList).toHaveBeenCalledWith(
				shoppingListId,
				{ ...item, quantity: 2 }
			);
		});

		it('throws error because update was not successful', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(item);
			mockedUpdateItemInShoppingList.mockResolvedValueOnce(null);
			await expect(
				updateShoppingItem(shoppingListId, { id: itemId, quantity: 2 })
			).rejects.toThrowError('Unable to update item');
		});

		it('returns correct result', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(item);
			mockedUpdateItemInShoppingList.mockResolvedValueOnce(item);
			const result = await updateShoppingItem(shoppingListId, {
				id: itemId,
				quantity: 2,
			});
			expect(result).toStrictEqual(item);
		});
	});

	describe('removeItemFromShoppingList', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const itemId = '635c712a6ad5ada00ab564dc';
		const shoppingItem: WithId<ShoppingItem> = {
			id: '635c712a6ad5ada00ab564dc',
			name: 'Apples',
			quantity: 1,
			status: 'New',
			unit: 'piece',
		};

		it('throws error from getItemInShoppingList', async () => {
			mockedGetItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			await expect(
				removeItemFromShoppingList(shoppingListId, itemId)
			).rejects.toThrowError('boom');
		});
		it('logs error from getItemInShoppingList', async () => {
			mockedGetItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await removeItemFromShoppingList(shoppingListId, itemId);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to remove item from shopping list',
				description: 'boom',
				shoppingListId,
				itemId,
			});
		});
		it('calls getItemInShoppingList with correct payload', async () => {
			mockedGetItemInShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await removeItemFromShoppingList(shoppingListId, itemId);
			} catch {}
			expect(mockedGetItemInShoppingList).toHaveBeenCalledWith({
				shoppingListId,
				itemId,
			});
		});
		it('throws error because shopping item is null', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(null);
			await expect(
				removeItemFromShoppingList(shoppingListId, itemId)
			).rejects.toThrowError('Item does not exist in shopping list');
		});
		it('logs error because shopping item is null', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(null);
			try {
				await removeItemFromShoppingList(shoppingListId, itemId);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to remove item from shopping list',
				description: 'Item does not exist in shopping list',
				shoppingListId,
				itemId,
			});
		});
		it('throws error from pullItemFromShoppingList', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(shoppingItem);
			mockedPullItemFromShoppingList.mockRejectedValueOnce(new Error('boom'));
			await expect(
				removeItemFromShoppingList(shoppingListId, itemId)
			).rejects.toThrowError('boom');
		});
		it('logs error from pullItemFromShoppingList', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(shoppingItem);
			mockedPullItemFromShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await removeItemFromShoppingList(shoppingListId, itemId);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to remove item from shopping list',
				description: 'boom',
				shoppingListId,
				itemId,
			});
		});
		it('calls pullItemFromShoppingList with correct payload', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(shoppingItem);
			mockedPullItemFromShoppingList.mockRejectedValueOnce(new Error('boom'));
			try {
				await removeItemFromShoppingList(shoppingListId, itemId);
			} catch {}
			expect(mockedPullItemFromShoppingList).toHaveBeenCalledWith(
				shoppingListId,
				shoppingItem
			);
		});
		it('throws error because deleted shopping item is null', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(shoppingItem);
			mockedPullItemFromShoppingList.mockResolvedValueOnce(null);
			await expect(
				removeItemFromShoppingList(shoppingListId, itemId)
			).rejects.toThrowError('Unable to update item');
		});
		it('logs error because deleted shopping item is null', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(shoppingItem);
			mockedPullItemFromShoppingList.mockResolvedValueOnce(null);
			try {
				await removeItemFromShoppingList(shoppingListId, itemId);
			} catch {}
			expect(mockedError).toHaveBeenCalledWith({
				message: 'Unable to remove item from shopping list',
				description: 'Unable to update item',
				shoppingListId,
				itemId,
			});
		});
		it('returns deleted shopping item', async () => {
			mockedGetItemInShoppingList.mockResolvedValueOnce(shoppingItem);
			mockedPullItemFromShoppingList.mockResolvedValueOnce(shoppingItem);
			const result = await removeItemFromShoppingList(shoppingListId, itemId);
			expect(result).toStrictEqual(shoppingItem);
		});
	});
});
