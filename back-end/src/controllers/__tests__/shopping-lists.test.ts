const mockedGetShoppingListById = jest.fn();
jest.mock('../../services/shopping-lists', () => {
	return { getShoppingListById: mockedGetShoppingListById };
});

import app from '../../../app';
import request from 'supertest';
import { mockedError } from '../../../jest/setupTests';

const agent = request.agent(app);

describe('controllers', () => {
	describe('Get shopping list by Id', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const shoppingList = {
			id: shoppingListId,
			name: 'Testing',
		};
		it('returns status 409 because shopping list Id is invalid', async () => {
			const response = await agent.get('/api/v1/shopping-lists/123');
			expect(response.status).toBe(409);
		});

		it('returns error message because shopping list Id is invalid', async () => {
			const response = await agent.get('/api/v1/shopping-lists/123');
			expect(response.body).toBe(
				'Shopping list Id needs to be 24 characters long.'
			);
		});

		it('logs error message because shopping list Id is invalid', async () => {
			await agent.get('/api/v1/shopping-lists/123');
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Shopping list Id needs to be 24 characters long.',
			});
		});

		it('calls getShoppingListById with correct payload', async () => {
			await agent.get(`/api/v1/shopping-lists/${shoppingListId}`);
			expect(mockedGetShoppingListById).toHaveBeenCalledWith(shoppingListId);
		});

		it('returns status 200', async () => {
			const response = await agent.get(
				`/api/v1/shopping-lists/${shoppingListId}`
			);
			expect(response.status).toBe(200);
		});

		it('returns shopping list in body', async () => {
			mockedGetShoppingListById.mockResolvedValueOnce(shoppingList);
			const response = await agent.get(
				`/api/v1/shopping-lists/${shoppingListId}`
			);
			expect(response.body).toStrictEqual(shoppingList);
		});
	});
});
