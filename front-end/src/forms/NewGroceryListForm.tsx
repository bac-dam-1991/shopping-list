import { Button, Stack, TextField } from '@mui/material';

export const NewGroceryListForm = () => {
	return (
		<form>
			<Stack spacing={2}>
				<TextField label="Item" />
				<TextField label="Quantity" />
				<Button variant="contained">Add</Button>
			</Stack>
		</form>
	);
};
