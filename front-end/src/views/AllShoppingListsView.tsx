import { Container, Typography, Stack, Button } from '@mui/material';
import { NewShoppingListForm } from '../forms/NewShoppingListForm';
import { useEffect, useState, useCallback } from 'react';
import { useGetAllShoppingListsApi } from '../apis/shopping-lists';
import { ShoppingListCard } from '../components/ShoppingListCard';
import { NewShoppingItemFormId } from '../forms/NewShoppingItemForm';
import { ShoppingList, WithId } from '@common/types';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Loader } from '../components/Loader';

const BaseAllShoppingListsView = () => {
	const [shoppingLists, setShoppingLists] = useState<WithId<ShoppingList>[]>(
		[]
	);
	const { getAllShoppingListsApi } = useGetAllShoppingListsApi();

	const getAllShoppingLists = useCallback(async () => {
		const data = await getAllShoppingListsApi();
		setShoppingLists(data);
	}, [getAllShoppingListsApi]);

	useEffect(() => {
		getAllShoppingLists();
	}, [getAllShoppingLists]);

	return (
		<Container maxWidth="sm">
			<Typography
				variant="h3"
				component="h1"
				sx={{ my: 5, textAlign: 'center' }}
			>
				My Shopping Lists
			</Typography>
			<Stack spacing={2}>
				<NewShoppingListForm
					refetch={getAllShoppingLists}
					formId={NewShoppingItemFormId}
				/>
				<Button variant="contained" type="submit" form={NewShoppingItemFormId}>
					Add
				</Button>
				{shoppingLists.map((list) => {
					return (
						<ShoppingListCard
							data={list}
							key={list.id}
							onRefetch={getAllShoppingLists}
						/>
					);
				})}
			</Stack>
		</Container>
	);
};

export const AllShoppingListsView = withAuthenticationRequired(
	BaseAllShoppingListsView,
	{ onRedirecting: () => <Loader /> }
);
