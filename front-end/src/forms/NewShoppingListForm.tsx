import { Button, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { addNewShoppingListApi } from '../apis/shopping-lists';

export interface NewShoppingListFormFields {
	name: string;
}
export interface NewShoppingListFormProps {
	refetch: () => Promise<void>;
}

export const NewShoppingListForm = ({ refetch }: NewShoppingListFormProps) => {
	const { register, handleSubmit, reset } = useForm<NewShoppingListFormFields>({
		defaultValues: { name: '' },
	});

	const onSubmit = async (formFields: NewShoppingListFormFields) => {
		await addNewShoppingListApi(formFields);
		await refetch();
		reset();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={2}>
				<TextField label="Name" {...register('name')} />
				<Button variant="contained" type="submit">
					Add
				</Button>
			</Stack>
		</form>
	);
};
