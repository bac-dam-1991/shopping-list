import { Button, Container, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { getShoppingListByIdApi } from '../apis/shopping-lists';
import {
	NewShoppingItemForm,
	NewShoppingItemFormId,
} from '../forms/NewShoppingItemForm';
import { ShoppingItemCard } from '../components/ShoppingItemCard';
import { ShoppingList, WithId } from '@common/types';

export const ShoppingListView = () => {
	const { id } = useParams();

	const [shoppingList, setShoppingList] = useState<WithId<ShoppingList> | null>(
		null
	);

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
					<Stack spacing={2}>
						<NewShoppingItemForm
							refetch={getShoppingListById}
							shoppingListId={id}
						/>
						<Button
							variant="contained"
							type="submit"
							form={NewShoppingItemFormId}
						>
							Add
						</Button>
					</Stack>
				)}
				{shoppingList &&
					shoppingList.items.map((item) => {
						return (
							<ShoppingItemCard
								data={item}
								key={item.id}
								onRefetch={getShoppingListById}
								shoppingListId={shoppingList.id}
							/>
						);
					})}
			</Stack>
		</Container>
	);
};
