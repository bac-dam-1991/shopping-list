const mockedGetShoppingListById = jest.fn();
const mockedAddNewShoppingList = jest.fn();
jest.mock('../../services/shopping-lists', () => {
	return {
		getShoppingListById: mockedGetShoppingListById,
		addNewShoppingList: mockedAddNewShoppingList,
	};
});

import app from '../../../app';
import request from 'supertest';
import { mockedError } from '../../../jest/setupTests';

const agent = request.agent(app);

describe('controllers', () => {
	describe('Get shopping list by Id endpoint', () => {
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

	describe('create new shopping list endpoint', () => {
		it('returns status code 409 because the shopping list name is missing', async () => {
			const response = await agent.post('/api/v1/shopping-lists');
			expect(response.status).toBe(409);
		});

		it('returns error message because the shopping list name is missing', async () => {
			const response = await agent.post('/api/v1/shopping-lists');
			expect(response.body).toBe('Shopping list name is required.');
		});

		it('returns status code 409 because the shopping list name is too short', async () => {
			const response = await agent
				.post('/api/v1/shopping-lists')
				.send({ name: 'a' });
			expect(response.status).toBe(409);
		});

		it('returns error message because the shopping list name is too short', async () => {
			const response = await agent
				.post('/api/v1/shopping-lists')
				.send({ name: 'a' });
			expect(response.body).toBe(
				'Shopping list name needs to be at least 3 characters long.'
			);
		});

		it('returns status code 409 because the shopping list name is too long', async () => {
			const response = await agent
				.post('/api/v1/shopping-lists')
				.send({ name: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' });
			expect(response.status).toBe(409);
		});

		it('returns error message because the shopping list name is too long', async () => {
			const response = await agent
				.post('/api/v1/shopping-lists')
				.send({ name: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' });
			expect(response.body).toBe(
				'Shopping list name cannot be more than 50 characters long.'
			);
		});

		it('calls addNewShoppingList with correct payload', async () => {
			await agent.post('/api/v1/shopping-lists').send({ name: 'Groceries' });
			expect(mockedAddNewShoppingList).toHaveBeenCalledWith('Groceries');
		});

		it('returns correct status for successfully adding new shopping list', async () => {
			const response = await agent
				.post('/api/v1/shopping-lists')
				.send({ name: 'Groceries' });
			expect(response.status).toBe(201);
		});

		it('returns newly created shopping list', async () => {
			mockedAddNewShoppingList.mockResolvedValueOnce({
				id: '637c992f469a46f7172b401b',
				name: 'Groceries',
				items: [],
			});
			const response = await agent
				.post('/api/v1/shopping-lists')
				.send({ name: 'Groceries' });
			expect(response.body).toStrictEqual({
				id: '637c992f469a46f7172b401b',
				name: 'Groceries',
				items: [],
			});
		});
	});
});
