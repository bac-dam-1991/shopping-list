import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ShoppingList } from './AllShoppingListsView';
import axios from 'axios';

export const ShoppingListView = () => {
	const { id } = useParams();

	const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);

	useEffect(() => {
		const getAllShoppingLists = async () => {
			const response = await axios.get(
				`http://localhost:3001/api/v1/shopping-lists/${id}`
			);
			setShoppingList(response.data);
		};
		getAllShoppingLists();
	}, [id]);

	return (
		<Container>
			{shoppingList ? (
				<Typography variant="h1">{shoppingList.name} List</Typography>
			) : (
				<Typography>Loading shopping list</Typography>
			)}
		</Container>
	);
};
