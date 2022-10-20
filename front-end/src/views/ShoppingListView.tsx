import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getShoppingListByIdApi, ShoppingList } from '../apis/shopping-lists';

export const ShoppingListView = () => {
	const { id } = useParams();

	const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);

	useEffect(() => {
		const getShoppingListById = async () => {
			if (!id) {
				return;
			}
			const data = await getShoppingListByIdApi(id);
			setShoppingList(data);
		};
		getShoppingListById();
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
