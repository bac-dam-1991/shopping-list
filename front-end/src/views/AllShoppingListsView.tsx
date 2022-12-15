import { Container, Typography, Stack, Button } from '@mui/material';
import { Modal } from '../components/Modal';
import {
	NewShoppingListForm,
	NewShoppingListFormId,
} from '../forms/NewShoppingListForm';
import { useEffect, useState, useCallback } from 'react';
import { useGetAllShoppingListsApi } from '../apis/shopping-lists';
import { ShoppingListCard } from '../components/ShoppingListCard';
import { ShoppingList, WithId } from '@common/types';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Loader } from '../components/Loader';

const BaseAllShoppingListsView = () => {
	const [shoppingLists, setShoppingLists] = useState<WithId<ShoppingList>[]>(
		[]
	);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const { getAllShoppingListsApi } = useGetAllShoppingListsApi();

	const getAllShoppingLists = useCallback(async () => {
		const data = await getAllShoppingListsApi();
		setShoppingLists(data);
	}, [getAllShoppingListsApi]);

	useEffect(() => {
		getAllShoppingLists();
	}, [getAllShoppingLists]);

	const openModal = () => {
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	return (
		<Container maxWidth="sm">
			<Typography
				variant="h4"
				component="h1"
				sx={{ my: 5, textAlign: 'center' }}
			>
				My Shopping Lists
			</Typography>
			<Stack spacing={2}>
				{shoppingLists.map((list) => {
					return (
						<ShoppingListCard
							data={list}
							key={list.id}
							onRefetch={getAllShoppingLists}
						/>
					);
				})}
				<Button variant="outlined" onClick={openModal}>
					Create new
				</Button>
			</Stack>
			<Modal
				open={modalVisible}
				onClose={closeModal}
				title="Add new shopping list"
				action={
					<>
						<Button variant="outlined" onClick={closeModal} fullWidth>
							Cancel
						</Button>
						<Button
							variant="contained"
							type="submit"
							form={NewShoppingListFormId}
							fullWidth
						>
							Add
						</Button>
					</>
				}
			>
				<NewShoppingListForm
					refetch={async () => {
						await getAllShoppingLists();
						closeModal();
					}}
					formId={NewShoppingListFormId}
				/>
			</Modal>
		</Container>
	);
};

export const AllShoppingListsView = withAuthenticationRequired(
	BaseAllShoppingListsView,
	{ onRedirecting: () => <Loader /> }
);
