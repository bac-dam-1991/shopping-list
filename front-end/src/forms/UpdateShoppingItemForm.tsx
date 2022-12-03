import { useUpdateShoppingItemApi } from '../apis/shopping-lists';
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
	formId?: string;
}

export const UpdateShoppingItemForm = ({
	itemId,
	shoppingListId,
	data,
	closeForm,
	refetch,
	formId,
}: UpdateShoppingItemFormProps) => {
	const { updateShoppingItemApi } = useUpdateShoppingItemApi();
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
			defaultValues={{
				name: data.name,
				quantity: data.quantity,
				unit: data.unit,
				status: data.status,
			}}
			formId={formId}
		/>
	);
};
