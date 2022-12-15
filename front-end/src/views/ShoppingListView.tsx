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
import { Modal } from '../components/Modal';

const BaseShoppingListView = () => {
	const { id } = useParams();
	const [modalVisible, setModalVisible] = useState<boolean>(false);

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

	const openModal = () => {
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	return (
		<Container maxWidth="sm">
			{shoppingList ? (
				<Typography
					variant="h4"
					component="h1"
					sx={{ my: 5, textAlign: 'center' }}
				>
					{shoppingList.name} List
				</Typography>
			) : (
				<Loader />
			)}
			<Stack spacing={2}>
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
				<Button variant="outlined" onClick={openModal}>
					Add item
				</Button>
			</Stack>
			<Modal
				open={modalVisible}
				onClose={closeModal}
				title="Add new item"
				action={
					<>
						<Button variant="outlined" onClick={closeModal} fullWidth>
							Cancel
						</Button>
						<Button
							variant="contained"
							type="submit"
							form={NewShoppingItemFormId}
							fullWidth
						>
							Add
						</Button>
					</>
				}
			>
				<NewShoppingItemForm
					refetch={async () => {
						await getShoppingListById();
						closeModal();
					}}
					shoppingListId={id!}
					formId={NewShoppingItemFormId}
				/>
			</Modal>
		</Container>
	);
};
export const ShoppingListView = withAuthenticationRequired(
	BaseShoppingListView,
	{ onRedirecting: () => <Loader /> }
);
