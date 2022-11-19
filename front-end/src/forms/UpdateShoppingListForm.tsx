import { Button, Stack, TextField } from '@mui/material';
import { updateShoppingListApi } from '../apis/shopping-lists';
import { useForm } from 'react-hook-form';

export interface UpdateShoppingListFormFields {
	id: string;
	name: string;
}

export interface UpdateShoppingListFormProps {
	refetch: () => Promise<void>;
	closeForm: () => void;
	data: UpdateShoppingListFormFields;
}

export const UpdateShoppingListForm = ({
	refetch,
	data,
	closeForm,
}: UpdateShoppingListFormProps) => {
	const { register, handleSubmit, reset } =
		useForm<UpdateShoppingListFormFields>({
			defaultValues: data,
		});

	const onSubmit = async (formFields: UpdateShoppingListFormFields) => {
		await updateShoppingListApi(data.id, formFields);
		await refetch();
		reset();
		closeForm();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={2}>
				<TextField autoFocus label="Name" {...register('name')} />
				<Button variant="outlined" type="submit">
					Update
				</Button>
			</Stack>
		</form>
	);
};
