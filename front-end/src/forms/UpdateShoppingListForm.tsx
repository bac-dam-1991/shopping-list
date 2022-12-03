import { useUpdateShoppingListApi } from '../apis/shopping-lists';
import {
	ShoppingListForm,
	ShoppingListFormFields,
	ShoppingListFormId,
} from './ShoppingListForm';

export const UpdateShoppingListFormId = `update-${ShoppingListFormId}`;

export interface UpdateShoppingListFormFields extends ShoppingListFormFields {}

export interface UpdateShoppingListFormProps {
	refetch: () => Promise<void>;
	closeForm: () => void;
	data: UpdateShoppingListFormFields;
	id: string;
	formId?: string;
}

export const UpdateShoppingListForm = ({
	refetch,
	data,
	closeForm,
	id,
	formId,
}: UpdateShoppingListFormProps) => {
	const { updateShoppingListApi } = useUpdateShoppingListApi();
	const onSubmit = async (formFields: UpdateShoppingListFormFields) => {
		await updateShoppingListApi(id, formFields);
		await refetch();
		closeForm();
	};

	return (
		<ShoppingListForm
			submitForm={onSubmit}
			defaultValues={data}
			formId={formId}
		/>
	);
};
