const mockedGetShoppingListById = jest.fn();
const mockedAddNewShoppingList = jest.fn();
const mockedUpdateShoppingList = jest.fn();
const mockedDeleteShoppingList = jest.fn();
const mockedAddNewItemToShoppingList = jest.fn();
const mockedUpdateShoppingItem = jest.fn();
const mockedRemoveItemFromShoppingList = jest.fn();
jest.mock('../../services/shopping-lists', () => {
	return {
		getShoppingListById: mockedGetShoppingListById,
		addNewShoppingList: mockedAddNewShoppingList,
		updateShoppingList: mockedUpdateShoppingList,
		deleteShoppingList: mockedDeleteShoppingList,
		addNewItemToShoppingList: mockedAddNewItemToShoppingList,
		updateShoppingItem: mockedUpdateShoppingItem,
		removeItemFromShoppingList: mockedRemoveItemFromShoppingList,
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

	describe('update a shopping list endpoint', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const newShoppingListName = 'Testing';

		it('returns status 409 because shopping list Id is invalid', async () => {
			const response = await agent
				.put('/api/v1/shopping-lists/123')
				.send({ name: newShoppingListName });
			expect(response.status).toBe(409);
		});

		it('returns error message because shopping list Id is invalid', async () => {
			const response = await agent
				.put('/api/v1/shopping-lists/123')
				.send({ name: newShoppingListName });
			expect(response.body).toBe(
				'Shopping list Id needs to be 24 characters long.'
			);
		});

		it('logs error message because shopping list Id is invalid', async () => {
			await agent
				.put('/api/v1/shopping-lists/123')
				.send({ name: newShoppingListName });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Shopping list Id needs to be 24 characters long.',
			});
		});

		it('returns status code 409 because the shopping list name is missing', async () => {
			const response = await agent.put(
				'/api/v1/shopping-lists/63552a5d00ca2e59a40c1f53'
			);
			expect(response.status).toBe(409);
		});

		it('returns error message because the shopping list name is missing', async () => {
			const response = await agent.put(
				'/api/v1/shopping-lists/63552a5d00ca2e59a40c1f53'
			);
			expect(response.body).toBe('Shopping list name is required.');
		});

		it('returns status code 409 because the shopping list name is too short', async () => {
			const response = await agent
				.put('/api/v1/shopping-lists/63552a5d00ca2e59a40c1f53')
				.send({ name: 'a' });
			expect(response.status).toBe(409);
		});

		it('returns error message because the shopping list name is too short', async () => {
			const response = await agent
				.put('/api/v1/shopping-lists/63552a5d00ca2e59a40c1f53')
				.send({ name: 'a' });
			expect(response.body).toBe(
				'Shopping list name needs to be at least 3 characters long.'
			);
		});

		it('returns status code 409 because the shopping list name is too long', async () => {
			const response = await agent
				.put('/api/v1/shopping-lists/63552a5d00ca2e59a40c1f53')
				.send({ name: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' });
			expect(response.status).toBe(409);
		});

		it('returns error message because the shopping list name is too long', async () => {
			const response = await agent
				.put('/api/v1/shopping-lists/63552a5d00ca2e59a40c1f53')
				.send({ name: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' });
			expect(response.body).toBe(
				'Shopping list name cannot be more than 50 characters long.'
			);
		});

		it('returns status code 500 because updateShoppingList throws error', async () => {
			mockedUpdateShoppingList.mockRejectedValueOnce(new Error('boom'));
			const response = await agent
				.put('/api/v1/shopping-lists/63552a5d00ca2e59a40c1f53')
				.send({ name: 'Testing' });
			expect(response.status).toBe(500);
		});

		it('returns error message because updateShoppingList throws error', async () => {
			mockedUpdateShoppingList.mockRejectedValueOnce(new Error('boom'));
			const response = await agent
				.put('/api/v1/shopping-lists/63552a5d00ca2e59a40c1f53')
				.send({ name: 'Testing' });
			expect(response.body).toBe('An unknown error has occurred.');
		});

		it('calls updateShoppingList with correct payload', async () => {
			mockedUpdateShoppingList.mockRejectedValueOnce(new Error('boom'));
			await agent
				.put('/api/v1/shopping-lists/63552a5d00ca2e59a40c1f53')
				.send({ name: 'Testing' });
			expect(mockedUpdateShoppingList).toHaveBeenCalledWith(shoppingListId, {
				name: newShoppingListName,
			});
		});

		it('returns shopping list when update successful', async () => {
			mockedUpdateShoppingList.mockResolvedValueOnce({
				id: '63552a5d00ca2e59a40c1f53',
				name: 'Pre-update',
				items: [],
			});
			const response = await agent
				.put('/api/v1/shopping-lists/63552a5d00ca2e59a40c1f53')
				.send({ name: 'Testing' });
			expect(response.body).toStrictEqual({
				id: '63552a5d00ca2e59a40c1f53',
				name: 'Pre-update',
				items: [],
			});
		});
	});

	describe('Delete shopping list by Id endpoint', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const shoppingList = {
			id: shoppingListId,
			name: 'Testing',
		};
		it('returns status 409 because shopping list Id is invalid', async () => {
			const response = await agent.delete('/api/v1/shopping-lists/123');
			expect(response.status).toBe(409);
		});

		it('returns error message because shopping list Id is invalid', async () => {
			const response = await agent.delete('/api/v1/shopping-lists/123');
			expect(response.body).toBe(
				'Shopping list Id needs to be 24 characters long.'
			);
		});

		it('logs error message because shopping list Id is invalid', async () => {
			await agent.delete('/api/v1/shopping-lists/123');
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Shopping list Id needs to be 24 characters long.',
			});
		});

		it('calls deleteShoppingList with correct payload', async () => {
			await agent.delete(`/api/v1/shopping-lists/${shoppingListId}`);
			expect(mockedDeleteShoppingList).toHaveBeenCalledWith(shoppingListId);
		});

		it('returns status 200', async () => {
			const response = await agent.delete(
				`/api/v1/shopping-lists/${shoppingListId}`
			);
			expect(response.status).toBe(200);
		});

		it('returns deleted shopping list in body', async () => {
			mockedDeleteShoppingList.mockResolvedValueOnce(shoppingList);
			const response = await agent.delete(
				`/api/v1/shopping-lists/${shoppingListId}`
			);
			expect(response.body).toStrictEqual(shoppingList);
		});
	});

	describe('add item to shopping list endpoint', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		it('returns status 409 because shopping list Id is invalid', async () => {
			const response = await agent.post(`/api/v1/shopping-lists/123/items/add`);
			expect(response.status).toBe(409);
		});

		it('returns error message because shopping list Id is invalid', async () => {
			const response = await agent.post(`/api/v1/shopping-lists/123/items/add`);
			expect(response.body).toBe(
				'Shopping list Id needs to be 24 characters long.'
			);
		});

		it('logs error message because shopping list Id is invalid', async () => {
			await agent.post(`/api/v1/shopping-lists/123/items/add`);
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Shopping list Id needs to be 24 characters long.',
			});
		});

		it('returns status 409 because item name is invalid', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'A' });
			expect(response.status).toBe(409);
		});

		it('returns error message because item name is invalid', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'A' });
			expect(response.body).toBe(
				'Item name needs to be at least 3 characters long.'
			);
		});

		it('logs error message because item name is invalid', async () => {
			await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'A' });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Item name needs to be at least 3 characters long.',
			});
		});

		it('returns status 409 because item status is missing', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana' });
			expect(response.status).toBe(409);
		});

		it('returns error message because item status is missing', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana' });
			expect(response.body).toBe('Item status is required.');
		});

		it('logs error message because item status is missing', async () => {
			await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana' });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Item status is required.',
			});
		});

		it('returns status 409 because item status is invalid', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'Hello' });
			expect(response.status).toBe(409);
		});

		it('returns error message because item status is invalid', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'Hello' });
			expect(response.body).toBe(
				'Invalid status. Valid statuses are [New, Updated, Purchased].'
			);
		});

		it('logs error message because item status is invalid', async () => {
			await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'Hello' });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description:
					'Invalid status. Valid statuses are [New, Updated, Purchased].',
			});
		});

		it('returns status 409 because quantity is missing', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New' });
			expect(response.status).toBe(409);
		});

		it('returns error message because quantity is missing', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New' });
			expect(response.body).toBe('Item quantity is required.');
		});

		it('logs error message because quantity is missing', async () => {
			await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New' });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Item quantity is required.',
			});
		});

		it('returns status 409 because quantity is invalid', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New', quantity: -1 });
			expect(response.status).toBe(409);
		});

		it('returns error message because quantity is invalid', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New', quantity: -1 });
			expect(response.body).toBe('Quantity cannot be less than 0.');
		});

		it('logs error message because quantity is invalid', async () => {
			await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New', quantity: -1 });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Quantity cannot be less than 0.',
			});
		});

		it('returns status 409 because unit is missing', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New', quantity: 1 });
			expect(response.status).toBe(409);
		});

		it('returns error message because unit is missing', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New', quantity: 1 });
			expect(response.body).toBe('Item unit is required.');
		});

		it('logs error message because unit is missing', async () => {
			await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New', quantity: 1 });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Item unit is required.',
			});
		});

		it('returns status 409 because unit is invalid', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New', quantity: 1, unit: 'foo' });
			expect(response.status).toBe(409);
		});

		it('returns error message because unit is invalid', async () => {
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New', quantity: 1, unit: 'foo' });
			expect(response.body).toBe(
				'Invalid unit. Valid units are [piece(s), kilogram(s), litre(s), box(es), millilitre(s), milligram(s), carton(s), bottle(s)].'
			);
		});

		it('logs error message because unit is invalid', async () => {
			await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({ name: 'Banana', status: 'New', quantity: 1, unit: 'foo' });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description:
					'Invalid unit. Valid units are [piece(s), kilogram(s), litre(s), box(es), millilitre(s), milligram(s), carton(s), bottle(s)].',
			});
		});

		it('returns status code 500 because generic error is thrown from addNewItemToShoppingList', async () => {
			mockedAddNewItemToShoppingList.mockRejectedValueOnce(new Error('boom'));
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({
					name: 'Banana',
					status: 'New',
					quantity: 1,
					unit: 'piece(s)',
				});
			expect(response.status).toBe(500);
		});

		it('returns correct error message because generic error is thrown from addNewItemToShoppingList', async () => {
			mockedAddNewItemToShoppingList.mockRejectedValueOnce(new Error('boom'));
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({
					name: 'Banana',
					status: 'New',
					quantity: 1,
					unit: 'piece(s)',
				});
			expect(response.body).toBe('An unknown error has occurred.');
		});

		it('returns status code 201 when everything succeeds', async () => {
			mockedAddNewItemToShoppingList.mockResolvedValueOnce({
				id: '1',
				name: 'Banana',
				status: 'New',
				quantity: 1,
				unit: 'piece(s)',
			});
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({
					name: 'Banana',
					status: 'New',
					quantity: 1,
					unit: 'piece(s)',
				});
			expect(response.status).toBe(201);
		});
		it('returns newly added shopping item', async () => {
			mockedAddNewItemToShoppingList.mockResolvedValueOnce({
				id: '1',
				name: 'Banana',
				status: 'New',
				quantity: 1,
				unit: 'piece(s)',
			});
			const response = await agent
				.post(`/api/v1/shopping-lists/${shoppingListId}/items/add`)
				.send({
					name: 'Banana',
					status: 'New',
					quantity: 1,
					unit: 'piece(s)',
				});
			expect(response.body).toStrictEqual({
				id: '1',
				name: 'Banana',
				status: 'New',
				quantity: 1,
				unit: 'piece(s)',
			});
		});
	});

	describe('udpate item in shopping list endpoint', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const itemId = '638158f471f9fba20a671d27';
		it('returns status 409 because shopping list Id is invalid', async () => {
			const response = await agent.put(
				`/api/v1/shopping-lists/123/items/${itemId}/update`
			);
			expect(response.status).toBe(409);
		});

		it('returns error message because shopping list Id is invalid', async () => {
			const response = await agent.put(
				`/api/v1/shopping-lists/123/items/${itemId}/update`
			);
			expect(response.body).toBe(
				'Shopping list Id needs to be 24 characters long.'
			);
		});

		it('logs error message because shopping list Id is invalid', async () => {
			await agent.put(`/api/v1/shopping-lists/123/items/${itemId}/update`);
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Shopping list Id needs to be 24 characters long.',
			});
		});

		it('returns status 409 because item Id is invalid', async () => {
			const response = await agent.put(
				`/api/v1/shopping-lists/${shoppingListId}/items/123/update`
			);
			expect(response.status).toBe(409);
		});

		it('returns error message because item Id is invalid', async () => {
			const response = await agent.put(
				`/api/v1/shopping-lists/${shoppingListId}/items/123/update`
			);
			expect(response.body).toBe('Item Id needs to be 24 characters long.');
		});

		it('logs error message because item Id is invalid', async () => {
			await agent.put(
				`/api/v1/shopping-lists/${shoppingListId}/items/123/update`
			);
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Item Id needs to be 24 characters long.',
			});
		});

		it('returns status 409 because item name is invalid', async () => {
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ name: 'A' });
			expect(response.status).toBe(409);
		});

		it('returns error message because item name is invalid', async () => {
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ name: 'A' });
			expect(response.body).toBe(
				'Item name needs to be at least 3 characters long.'
			);
		});

		it('logs error message because item name is invalid', async () => {
			await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ name: 'A' });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Item name needs to be at least 3 characters long.',
			});
		});

		it('returns status 409 because item status is invalid', async () => {
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ status: 'Hello' });
			expect(response.status).toBe(409);
		});

		it('returns error message because item status is invalid', async () => {
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ status: 'Hello' });
			expect(response.body).toBe(
				'Invalid status. Valid statuses are [New, Updated, Purchased].'
			);
		});

		it('logs error message because item status is invalid', async () => {
			await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ status: 'Hello' });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description:
					'Invalid status. Valid statuses are [New, Updated, Purchased].',
			});
		});

		it('returns status 409 because quantity is invalid', async () => {
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ quantity: -1 });
			expect(response.status).toBe(409);
		});

		it('returns error message because quantity is invalid', async () => {
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ quantity: -1 });
			expect(response.body).toBe('Quantity cannot be less than 0.');
		});

		it('logs error message because quantity is invalid', async () => {
			await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ quantity: -1 });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Quantity cannot be less than 0.',
			});
		});

		it('returns status 409 because unit is invalid', async () => {
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ unit: 'foo' });
			expect(response.status).toBe(409);
		});

		it('returns error message because unit is invalid', async () => {
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ unit: 'foo' });
			expect(response.body).toBe(
				'Invalid unit. Valid units are [piece(s), kilogram(s), litre(s), box(es), millilitre(s), milligram(s), carton(s), bottle(s)].'
			);
		});

		it('logs error message because unit is invalid', async () => {
			await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({ unit: 'foo' });
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description:
					'Invalid unit. Valid units are [piece(s), kilogram(s), litre(s), box(es), millilitre(s), milligram(s), carton(s), bottle(s)].',
			});
		});

		it('returns status code 500 because generic error is thrown from updateShoppingItem', async () => {
			mockedUpdateShoppingItem.mockRejectedValueOnce(new Error('boom'));
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({
					status: 'Purchased',
				});
			expect(response.status).toBe(500);
		});

		it('returns correct error message because generic error is thrown from updateShoppingItem', async () => {
			mockedUpdateShoppingItem.mockRejectedValueOnce(new Error('boom'));
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({
					status: 'Purchased',
				});
			expect(response.body).toBe('An unknown error has occurred.');
		});

		it('returns status code 200 when everything succeeds', async () => {
			mockedUpdateShoppingItem.mockResolvedValueOnce({
				id: '1',
				name: 'Banana',
				status: 'Purchased',
				quantity: 1,
				unit: 'piece(s)',
			});
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({
					status: 'Purchased',
				});
			expect(response.status).toBe(200);
		});
		it('returns newly updated shopping item', async () => {
			mockedUpdateShoppingItem.mockResolvedValueOnce({
				id: '1',
				name: 'Banana',
				status: 'Purchased',
				quantity: 1,
				unit: 'piece(s)',
			});
			const response = await agent
				.put(`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/update`)
				.send({
					status: 'Purchased',
				});
			expect(response.body).toStrictEqual({
				id: '1',
				name: 'Banana',
				quantity: 1,
				unit: 'piece(s)',
				status: 'Purchased',
			});
		});
	});

	describe('udpate item in shopping list endpoint', () => {
		const shoppingListId = '63552a5d00ca2e59a40c1f53';
		const itemId = '638158f471f9fba20a671d27';
		it('returns status 409 because shopping list Id is invalid', async () => {
			const response = await agent.put(
				`/api/v1/shopping-lists/123/items/${itemId}/delete`
			);
			expect(response.status).toBe(409);
		});

		it('returns error message because shopping list Id is invalid', async () => {
			const response = await agent.put(
				`/api/v1/shopping-lists/123/items/${itemId}/delete`
			);
			expect(response.body).toBe(
				'Shopping list Id needs to be 24 characters long.'
			);
		});

		it('logs error message because shopping list Id is invalid', async () => {
			await agent.put(`/api/v1/shopping-lists/123/items/${itemId}/delete`);
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Shopping list Id needs to be 24 characters long.',
			});
		});

		it('returns status 409 because item Id is invalid', async () => {
			const response = await agent.put(
				`/api/v1/shopping-lists/${shoppingListId}/items/123/delete`
			);
			expect(response.status).toBe(409);
		});

		it('returns error message because item Id is invalid', async () => {
			const response = await agent.put(
				`/api/v1/shopping-lists/${shoppingListId}/items/123/delete`
			);
			expect(response.body).toBe('Item Id needs to be 24 characters long.');
		});

		it('logs error message because item Id is invalid', async () => {
			await agent.put(
				`/api/v1/shopping-lists/${shoppingListId}/items/123/delete`
			);
			expect(mockedError).toHaveBeenCalledWith({
				message: 'An error occurred',
				description: 'Item Id needs to be 24 characters long.',
			});
		});

		it('returns status code 500 because generic error is thrown from removeItemFromShoppingList', async () => {
			mockedRemoveItemFromShoppingList.mockRejectedValueOnce(new Error('boom'));
			const response = await agent.put(
				`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/delete`
			);
			expect(response.status).toBe(500);
		});

		it('returns correct error message because generic error is thrown from removeItemFromShoppingList', async () => {
			mockedRemoveItemFromShoppingList.mockRejectedValueOnce(new Error('boom'));
			const response = await agent.put(
				`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/delete`
			);
			expect(response.body).toBe('An unknown error has occurred.');
		});

		it('returns status code 200 when everything succeeds', async () => {
			mockedRemoveItemFromShoppingList.mockResolvedValueOnce({
				id: '1',
				name: 'Banana',
				status: 'Purchased',
				quantity: 1,
				unit: 'piece(s)',
			});
			const response = await agent.put(
				`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/delete`
			);
			expect(response.status).toBe(200);
		});

		it('returns deleted shopping item', async () => {
			mockedRemoveItemFromShoppingList.mockResolvedValueOnce({
				id: '1',
				name: 'Banana',
				status: 'Purchased',
				quantity: 1,
				unit: 'piece(s)',
			});
			const response = await agent.put(
				`/api/v1/shopping-lists/${shoppingListId}/items/${itemId}/delete`
			);
			expect(response.body).toStrictEqual({
				id: '1',
				name: 'Banana',
				quantity: 1,
				unit: 'piece(s)',
				status: 'Purchased',
			});
		});
	});
});
