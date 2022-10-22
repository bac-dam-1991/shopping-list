import { Container, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getShoppingListByIdApi, ShoppingList } from '../apis/shopping-lists';
import { NewShoppingItemForm } from '../forms/NewShoppingItemForm';

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
			<Stack spacing={2}>
				{shoppingList ? (
					<Typography variant="h1">{shoppingList.name} List</Typography>
				) : (
					<Typography>Loading shopping list</Typography>
				)}
				{id && (
					<NewShoppingItemForm refetch={async () => {}} shoppingListId={id} />
				)}
			</Stack>
		</Container>
	);
};
