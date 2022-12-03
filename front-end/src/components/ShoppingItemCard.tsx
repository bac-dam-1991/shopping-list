import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import {
	Typography,
	Stack,
	Paper,
	IconButton,
	Chip,
	Button,
} from '@mui/material';
import { useRemoveShoppingItemApi } from '../apis/shopping-lists';
import { useState } from 'react';
import {
	UpdateShoppingItemForm,
	UpdateShoppingItemFormId,
} from '../forms/UpdateShoppingItemForm';
import { ShoppingItem, WithId } from '@common/types';

export interface ShoppingItemCardProps {
	data: WithId<ShoppingItem>;
	onRefetch: () => Promise<void>;
	shoppingListId: string;
}

export const ShoppingItemCard = ({
	data,
	onRefetch,
	shoppingListId,
}: ShoppingItemCardProps) => {
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const { removeShoppingItemApi } = useRemoveShoppingItemApi();

	const handleCancelUpdate = () => {
		setIsUpdating(false);
	};

	const handleDeleteItem = async () => {
		await removeShoppingItemApi(shoppingListId, data.id);
		await onRefetch();
	};

	const getChipColour = () => {
		if (data.status === 'Purchased') {
			return 'success';
		} else if (data.status === 'New') {
			return 'primary';
		} else {
			return 'warning';
		}
	};

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Stack
					direction="row"
					alignItems={'center'}
					justifyContent="space-between"
				>
					<Typography variant="body1">
						{data.name} - {data.quantity} {data.unit}
					</Typography>

					<Stack direction={'row'} spacing={2} alignItems="center">
						<Chip label={data.status} color={getChipColour()} size="small" />
						<IconButton
							color="error"
							onClick={handleDeleteItem}
							disabled={isUpdating}
						>
							<DeleteForeverRoundedIcon color="inherit" />
						</IconButton>

						{isUpdating ? (
							<IconButton onClick={handleCancelUpdate}>
								<CancelRoundedIcon color="primary" />
							</IconButton>
						) : (
							<IconButton onClick={() => setIsUpdating(true)}>
								<EditRoundedIcon color="primary" />
							</IconButton>
						)}
					</Stack>
				</Stack>
				{isUpdating && (
					<Stack spacing={2}>
						<UpdateShoppingItemForm
							shoppingListId={shoppingListId}
							itemId={data.id}
							data={data}
							refetch={onRefetch}
							closeForm={() => setIsUpdating(false)}
							formId={`${data.id}-${UpdateShoppingItemFormId}`}
						/>
						<Button
							variant="contained"
							type="submit"
							form={`${data.id}-${UpdateShoppingItemFormId}`}
						>
							Update
						</Button>
					</Stack>
				)}
			</Stack>
		</Paper>
	);
};
