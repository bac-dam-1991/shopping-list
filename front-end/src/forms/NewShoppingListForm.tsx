import { Button, Stack, TextField } from '@mui/material';
import { useState, ChangeEventHandler, FormEventHandler } from 'react';
import { addNewShoppingListApi } from '../apis/shopping-lists';

export interface NewShoppingListFormProps {
	refetch: () => Promise<void>;
}

export const NewShoppingListForm = ({ refetch }: NewShoppingListFormProps) => {
	const [name, setName] = useState<string>('');

	const submitForm: FormEventHandler = async (event) => {
		event.preventDefault();
		await addNewShoppingListApi({ name });
		await refetch();
		setName('');
	};

	const handleNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const val = event.target.value;
		setName(val);
	};

	return (
		<form onSubmit={submitForm}>
			<Stack spacing={2}>
				<TextField label="Name" value={name} onChange={handleNameChange} />
				<Button variant="contained" type="submit">
					Add
				</Button>
			</Stack>
		</form>
	);
};
