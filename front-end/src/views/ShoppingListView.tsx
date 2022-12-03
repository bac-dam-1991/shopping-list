import { Button, Container, Stack, Typography } from '@mui/material';
import { Loader } from '../components/Loader';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useGetShoppingListByIdApi } from '../apis/shopping-lists';
import {
	NewShoppingItemForm,
	NewShoppingItemFormId,
} from '../forms/NewShoppingItemForm';
import { ShoppingItemCard } from '../components/ShoppingItemCard';
import { ShoppingList, WithId } from '@common/types';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const BaseShoppingListView = () => {
	const { id } = useParams();

	const [shoppingList, setShoppingList] = useState<WithId<ShoppingList> | null>(
		null
	);
	const { getShoppingListByIdApi } = useGetShoppingListByIdApi();

	const getShoppingListById = useCallback(async () => {
		if (!id) {
			return;
		}
		const data = await getShoppingListByIdApi(id);
		setShoppingList(data);
	}, [id, getShoppingListByIdApi]);

	useEffect(() => {
		getShoppingListById();
	}, [getShoppingListById]);

	return (
		<Container maxWidth="sm">
			{shoppingList ? (
				<Typography
					variant="h3"
					component="h1"
					sx={{ my: 5, textAlign: 'center' }}
				>
					{shoppingList.name} List
				</Typography>
			) : (
				<Loader />
			)}
			<Stack spacing={2}>
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
export const ShoppingListView = withAuthenticationRequired(
	BaseShoppingListView,
	{ onRedirecting: () => <Loader /> }
);
