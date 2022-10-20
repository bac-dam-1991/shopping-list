import { Container, Typography, Stack, Box } from '@mui/material';
import { NewShoppingListForm } from '../forms/NewShoppingListForm';
import { useEffect, useState, useCallback } from 'react';
import { getAllShoppingListsApi, ShoppingList } from '../apis/shopping-lists';

export const AllShoppingListsView = () => {
	const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

	const getAllShoppingLists = useCallback(async () => {
		const data = await getAllShoppingListsApi();
		setShoppingLists(data);
	}, []);

	useEffect(() => {
		getAllShoppingLists();
	}, [getAllShoppingLists]);

	return (
		<Container>
			<Stack spacing={2}>
				<Typography variant="h1">All Shopping Lists</Typography>
				<NewShoppingListForm refetch={getAllShoppingLists} />
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
