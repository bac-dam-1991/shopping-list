import { updateShoppingItemApi } from '../apis/shopping-lists';
import {
	ShoppingItemForm,
	ShoppingItemFormFields,
	ShoppingItemFormId,
} from './ShoppingItemForm';

export const UpdateShoppingItemFormId = `update-${ShoppingItemFormId}`;

export interface UpdateShoppingItemFormProps {
	shoppingListId: string;
	itemId: string;
	data: ShoppingItemFormFields;
	closeForm: () => void;
	refetch: () => Promise<void>;
}

export const UpdateShoppingItemForm = ({
	itemId,
	shoppingListId,
	data,
	closeForm,
	refetch,
}: UpdateShoppingItemFormProps) => {
	const submitForm = async (formValues: ShoppingItemFormFields) => {
		await updateShoppingItemApi(shoppingListId, {
			id: itemId,
			...formValues,
		});
		await refetch();
		closeForm();
	};

	return (
		<ShoppingItemForm
			submitForm={submitForm}
			defaultValues={data}
			formId={UpdateShoppingItemFormId}
		/>
	);
};
