import { updateShoppingListApi } from '../apis/shopping-lists';
import { ShoppingListForm, ShoppingListFormFields } from './ShoppingListForm';

export interface UpdateShoppingListFormFields extends ShoppingListFormFields {}

export interface UpdateShoppingListFormProps {
	refetch: () => Promise<void>;
	closeForm: () => void;
	data: UpdateShoppingListFormFields;
	id: string;
}

export const UpdateShoppingListForm = ({
	refetch,
	data,
	closeForm,
	id,
}: UpdateShoppingListFormProps) => {
	const onSubmit = async (formFields: UpdateShoppingListFormFields) => {
		await updateShoppingListApi(id, formFields);
		await refetch();
		closeForm();
	};

	return <ShoppingListForm submitForm={onSubmit} defaultValues={data} />;
};
