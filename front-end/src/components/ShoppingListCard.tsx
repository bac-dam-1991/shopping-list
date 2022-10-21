import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { UpdateShoppingListForm } from '../forms/UpdateShoppingListForm';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { Typography, Stack, Paper, IconButton } from '@mui/material';
import { ShoppingList } from '../apis/shopping-lists';
import { useState } from 'react';

export interface ShoppingListCardProps {
	data: ShoppingList;
	onDelete: () => Promise<void>;
	onRefetch: () => Promise<void>;
}

export const ShoppingListCard = ({
	data,
	onDelete,
	onRefetch,
}: ShoppingListCardProps) => {
	const [isUpdating, setIsUpdating] = useState<boolean>(false);

	const handleCancelUpdate = () => {
		setIsUpdating(false);
	};

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Stack
					direction="row"
					alignItems={'center'}
					justifyContent="space-between"
				>
					<Typography variant="body1">{data.name}</Typography>
					<Stack direction={'row'} spacing={2}>
						<IconButton onClick={onDelete}>
							<DeleteForeverRoundedIcon color="error" />
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
					<UpdateShoppingListForm
						closeForm={handleCancelUpdate}
						refetch={onRefetch}
						data={data}
					/>
				)}
			</Stack>
		</Paper>
	);
};
