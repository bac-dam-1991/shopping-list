const mockedFind = jest.fn();
const mockedFindOne = jest.fn();
jest.mock('../adapters/mongo', () => {
	return {
		find: mockedFind,
		findOne: mockedFindOne,
	};
});

import { findAllShoppingLists, findShoppingListById } from '../shopping-lists';
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
		it('throws error from findOne', async () => {
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
});
