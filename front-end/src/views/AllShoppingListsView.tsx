import { Container, Typography } from '@mui/material';
import { NewGroceryListForm } from '../forms/NewGroceryListForm';

export const AllShoppingListsView = () => {
	return (
		<Container>
			<Typography variant="h1">All Shopping Lists</Typography>
			<NewGroceryListForm />
		</Container>
	);
};
