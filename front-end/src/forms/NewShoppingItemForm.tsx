import { addItemToShoppingListApi } from '../apis/shopping-lists';
import {
	ShoppingItemForm,
	ShoppingItemFormFields,
	ShoppingItemFormId,
} from './ShoppingItemForm';

export const NewShoppingItemFormId = `new-${ShoppingItemFormId}`;

export interface NewShoppingItemFormProps {
	refetch: () => Promise<void>;
	shoppingListId: string;
}

export const NewShoppingItemForm = ({
	refetch,
	shoppingListId,
}: NewShoppingItemFormProps) => {
	const submitForm = async (formValues: ShoppingItemFormFields) => {
		await addItemToShoppingListApi(shoppingListId, formValues);
		await refetch();
	};

	return (
		<ShoppingItemForm submitForm={submitForm} formId={NewShoppingItemFormId} />
	);
};
