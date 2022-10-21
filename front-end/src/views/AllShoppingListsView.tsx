import { Container, Typography, Stack, Paper, IconButton } from '@mui/material';
import { NewShoppingListForm } from '../forms/NewShoppingListForm';
import { useEffect, useState, useCallback } from 'react';
import {
	deleteShoppingListApi,
	getAllShoppingListsApi,
	ShoppingList,
} from '../apis/shopping-lists';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { UpdateShoppingListForm } from '../forms/UpdateShoppingListForm';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

export const AllShoppingListsView = () => {
	const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
	const [selectedShoppingList, setSelectedShoppingList] =
		useState<ShoppingList | null>(null);

	const getAllShoppingLists = useCallback(async () => {
		const data = await getAllShoppingListsApi();
		setShoppingLists(data);
	}, []);

	const deleteShoppingList = async (id: string) => {
		await deleteShoppingListApi(id);
		await getAllShoppingLists();
	};

	const closeUpdateForm = () => {
		setSelectedShoppingList(null);
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
							<Stack spacing={2}>
								<Stack
									direction="row"
									alignItems={'center'}
									justifyContent="space-between"
								>
									<Typography variant="body1">{list.name}</Typography>
									<Stack direction={'row'} spacing={2}>
										<IconButton onClick={() => deleteShoppingList(list.id)}>
											<DeleteForeverRoundedIcon color="error" />
										</IconButton>

										{selectedShoppingList &&
										selectedShoppingList.id === list.id ? (
											<IconButton onClick={closeUpdateForm}>
												<CancelRoundedIcon color="primary" />
											</IconButton>
										) : (
											<IconButton onClick={() => setSelectedShoppingList(list)}>
												<EditRoundedIcon color="primary" />
											</IconButton>
										)}
									</Stack>
								</Stack>
								{selectedShoppingList &&
									selectedShoppingList.id === list.id && (
										<UpdateShoppingListForm
											closeForm={closeUpdateForm}
											refetch={getAllShoppingLists}
											data={selectedShoppingList}
										/>
									)}
							</Stack>
						</Paper>
					);
				})}
			</Stack>
		</Container>
	);
};
