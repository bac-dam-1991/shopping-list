const mockedFind = jest.fn();
jest.mock('../adapters/mongo', () => {
	return {
		find: mockedFind,
	};
});

import { findAllShoppingLists } from '../shopping-lists';
import { mockedError } from '../../../jest/setupTests';

describe('shopping lists repository functions', () => {
	const mockedResult = [
		{
			name: 'Fruits and Vegs',
			items: [],
			id: '63552a5d00ca2e59a40c1f53',
		},
	];
	describe('findAllShoppingLists', () => {
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
});
