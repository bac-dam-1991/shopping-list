import { useAddItemToShoppingListApi } from '../apis/shopping-lists';
import {
	ShoppingItemForm,
	ShoppingItemFormFields,
	ShoppingItemFormId,
} from './ShoppingItemForm';

export const NewShoppingItemFormId = `new-${ShoppingItemFormId}`;

export interface NewShoppingItemFormProps {
	refetch: () => Promise<void>;
	shoppingListId: string;
	formId?: string;
}

export const NewShoppingItemForm = ({
	refetch,
	formId,
	shoppingListId,
}: NewShoppingItemFormProps) => {
	const { addItemToShoppingListApi } = useAddItemToShoppingListApi();
	const submitForm = async (formValues: ShoppingItemFormFields) => {
		await addItemToShoppingListApi(shoppingListId, formValues);
		await refetch();
	};

	return <ShoppingItemForm submitForm={submitForm} formId={formId} />;
};
