import { Container, Typography, Stack, Paper, IconButton } from '@mui/material';
import { NewShoppingListForm } from '../forms/NewShoppingListForm';
import { useEffect, useState, useCallback } from 'react';
import {
	deleteShoppingListApi,
	getAllShoppingListsApi,
	ShoppingList,
} from '../apis/shopping-lists';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

export const AllShoppingListsView = () => {
	const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

	const getAllShoppingLists = useCallback(async () => {
		const data = await getAllShoppingListsApi();
		setShoppingLists(data);
	}, []);

	const deleteShoppingList = async (id: string) => {
		await deleteShoppingListApi(id);
		await getAllShoppingLists();
	};

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
						<Paper key={list.id} sx={{ p: 2 }}>
							<Stack
								direction="row"
								alignItems={'center'}
								justifyContent="space-between"
							>
								<Typography variant="body1">{list.name}</Typography>
								<IconButton onClick={() => deleteShoppingList(list.id)}>
									<DeleteForeverRoundedIcon color="error" />
								</IconButton>
							</Stack>
						</Paper>
					);
				})}
			</Stack>
		</Container>
	);
};
