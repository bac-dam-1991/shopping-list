import { Button, Stack, TextField } from '@mui/material';
import { useState, ChangeEventHandler, FormEventHandler } from 'react';
import { updateShoppingListApi, ShoppingList } from '../apis/shopping-lists';

export interface UpdateShoppingListFormProps {
	refetch: () => Promise<void>;
	closeForm: () => void;
	data: ShoppingList;
}

export const UpdateShoppingListForm = ({
	refetch,
	data,
	closeForm,
}: UpdateShoppingListFormProps) => {
	const [name, setName] = useState<string>(data.name);

	const submitForm: FormEventHandler = async (event) => {
		event.preventDefault();
		await updateShoppingListApi(data.id, { name });
		setName('');
		await refetch();
		closeForm();
	};

	const handleNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const val = event.target.value;
		setName(val);
	};

	return (
		<form onSubmit={submitForm}>
			<Stack spacing={2}>
				<TextField
					autoFocus
					label="Name"
					value={name}
					onChange={handleNameChange}
				/>
				<Button variant="outlined" type="submit">
					Update
				</Button>
			</Stack>
		</form>
	);
};
