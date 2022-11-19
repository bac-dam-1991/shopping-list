import { Button, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

export interface ShoppingListFormFields {
	name: string;
}
export interface ShoppingListFormProps {
	defaultValues?: ShoppingListFormFields;
	submitForm: (formFields: ShoppingListFormFields) => Promise<void>;
}

export const ShoppingListForm = ({
	defaultValues = { name: '' },
	submitForm,
}: ShoppingListFormProps) => {
	const { register, handleSubmit, reset } = useForm<ShoppingListFormFields>({
		defaultValues,
	});

	const onSubmit = async (formFields: ShoppingListFormFields) => {
		await submitForm(formFields);
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
