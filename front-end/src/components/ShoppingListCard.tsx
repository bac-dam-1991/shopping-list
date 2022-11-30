import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { UpdateShoppingListForm } from '../forms/UpdateShoppingListForm';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { Typography, Stack, Paper, IconButton, Button } from '@mui/material';
import { deleteShoppingListApi, ShoppingList } from '../apis/shopping-lists';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { UpdateShoppingItemFormId } from '../forms/UpdateShoppingItemForm';

export interface ShoppingListCardProps {
	data: ShoppingList;
	onRefetch: () => Promise<void>;
}

export const ShoppingListCard = ({
	data,
	onRefetch,
}: ShoppingListCardProps) => {
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleCancelUpdate = () => {
		setIsUpdating(false);
	};

	const handleDeleteShoppingList = async () => {
		await deleteShoppingListApi(data.id);
		await onRefetch();
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
						<IconButton
							color="primary"
							onClick={() => navigate(data.id)}
							disabled={isUpdating}
						>
							<VisibilityIcon color="inherit" />
						</IconButton>
						<IconButton
							color="error"
							onClick={handleDeleteShoppingList}
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
						<UpdateShoppingListForm
							closeForm={handleCancelUpdate}
							refetch={onRefetch}
							data={{ name: data.name }}
							id={data.id}
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
