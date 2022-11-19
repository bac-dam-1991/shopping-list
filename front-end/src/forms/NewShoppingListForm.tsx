import { addNewShoppingListApi } from '../apis/shopping-lists';
import { ShoppingListForm, ShoppingListFormFields } from './ShoppingListForm';

export interface NewShoppingListFormFields extends ShoppingListFormFields {}
export interface NewShoppingListFormProps {
	refetch: () => Promise<void>;
}

export const NewShoppingListForm = ({ refetch }: NewShoppingListFormProps) => {
	const onSubmit = async (formFields: NewShoppingListFormFields) => {
		await addNewShoppingListApi(formFields);
		await refetch();
	};

	return <ShoppingListForm submitForm={onSubmit} />;
};
