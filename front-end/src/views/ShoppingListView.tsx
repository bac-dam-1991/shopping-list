import { Container, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { getShoppingListByIdApi, ShoppingList } from '../apis/shopping-lists';
import { NewShoppingItemForm } from '../forms/NewShoppingItemForm';
import { ShoppingItemCard } from '../components/ShoppingItemCard';

export const ShoppingListView = () => {
	const { id } = useParams();

	const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);

	const getShoppingListById = useCallback(async () => {
		if (!id) {
			return;
		}
		const data = await getShoppingListByIdApi(id);
		setShoppingList(data);
	}, [id]);

	useEffect(() => {
		getShoppingListById();
	}, [getShoppingListById]);

	return (
		<Container>
			<Stack spacing={2}>
				{shoppingList ? (
					<Typography variant="h1">{shoppingList.name} List</Typography>
				) : (
					<Typography>Loading shopping list</Typography>
				)}
				{id && (
					<NewShoppingItemForm
						refetch={getShoppingListById}
						shoppingListId={id}
					/>
				)}
				{shoppingList &&
					shoppingList.items.map((item) => {
						return (
							<ShoppingItemCard
								data={item}
								key={item.id}
								onDelete={async () => {}}
								onRefetch={getShoppingListById}
							/>
						);
					})}
			</Stack>
		</Container>
	);
};
