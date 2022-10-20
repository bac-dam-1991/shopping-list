import { Container, Typography, Stack, Box } from '@mui/material';
import { NewGroceryListForm } from '../forms/NewGroceryListForm';
import { useEffect, useState } from 'react';
import { Client } from '../apis';

export interface ShoppingList {
	name: string;
	id: string;
}

export const AllShoppingListsView = () => {
	const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

	useEffect(() => {
		const getAllShoppingLists = async () => {
			const response = await Client.get('shopping-lists');
			setShoppingLists(response.data);
		};
		getAllShoppingLists();
	}, []);

	return (
		<Container>
			<Stack spacing={2}>
				<Typography variant="h1">All Shopping Lists</Typography>
				<NewGroceryListForm />
				{shoppingLists.map((list) => {
					return (
						<Box key={list.id}>
							<Typography variant="body1">{list.name}</Typography>
						</Box>
					);
				})}
			</Stack>
		</Container>
	);
};
