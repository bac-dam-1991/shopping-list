import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { Typography, Stack, Paper, IconButton, Chip } from '@mui/material';
import { ShoppingItem } from '../apis/shopping-lists';
import { useState } from 'react';
import { UpdateShoppingItemForm } from '../forms/UpdateShoppingItemForm';

export interface ShoppingItemCardProps {
	data: ShoppingItem;
	onDelete: () => Promise<void>;
	onRefetch: () => Promise<void>;
	shoppingListId: string;
}

export const ShoppingItemCard = ({
	data,
	onDelete,
	onRefetch,
	shoppingListId,
}: ShoppingItemCardProps) => {
	const [isUpdating, setIsUpdating] = useState<boolean>(false);

	const handleCancelUpdate = () => {
		setIsUpdating(false);
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
						<IconButton color="error" onClick={onDelete} disabled={isUpdating}>
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
					<UpdateShoppingItemForm
						shoppingListId={shoppingListId}
						data={data}
						refetch={onRefetch}
						closeForm={() => setIsUpdating(false)}
					/>
				)}
			</Stack>
		</Paper>
	);
};
