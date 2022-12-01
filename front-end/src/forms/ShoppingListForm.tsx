import { Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { ShoppingListNameSchema } from '@common/schemas';

const Schema = Joi.object().keys({
	name: ShoppingListNameSchema,
});

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
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ShoppingListFormFields>({
		defaultValues,
		resolver: joiResolver(Schema),
	});

	const onSubmit = async (formFields: ShoppingListFormFields) => {
		await submitForm(formFields);
		reset();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} id={formId}>
			<Stack spacing={2}>
				<TextField
					label="Name"
					{...register('name')}
					helperText={errors.name?.message}
					error={Boolean(errors.name?.message)}
				/>
			</Stack>
		</form>
	);
};
