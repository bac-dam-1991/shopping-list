import { Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

export const ShoppingListFormId = 'shopping-list-form-id';

export interface ShoppingListFormFields {
	name: string;
}
export interface ShoppingListFormProps {
	defaultValues?: ShoppingListFormFields;
	submitForm: (formFields: ShoppingListFormFields) => Promise<void>;
	formId?: string;
}

export const ShoppingListForm = ({
	defaultValues = { name: '' },
	submitForm,
	formId,
}: ShoppingListFormProps) => {
	const { register, handleSubmit, reset } = useForm<ShoppingListFormFields>({
		defaultValues,
	});

	const onSubmit = async (formFields: ShoppingListFormFields) => {
		await submitForm(formFields);
		reset();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} id={formId}>
			<Stack spacing={2}>
				<TextField label="Name" {...register('name')} />
			</Stack>
		</form>
	);
};
