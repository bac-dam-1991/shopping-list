import { addNewShoppingListApi } from '../apis/shopping-lists';
import {
	ShoppingListForm,
	ShoppingListFormFields,
	ShoppingListFormId,
} from './ShoppingListForm';

export const NewShoppingListFormId = `new-${ShoppingListFormId}`;

export interface NewShoppingListFormFields extends ShoppingListFormFields {}
export interface NewShoppingListFormProps {
	refetch: () => Promise<void>;
	formId?: string;
}

export const NewShoppingListForm = ({
	refetch,
	formId,
}: NewShoppingListFormProps) => {
	const onSubmit = async (formFields: NewShoppingListFormFields) => {
		await addNewShoppingListApi(formFields);
		await refetch();
	};

	return <ShoppingListForm submitForm={onSubmit} formId={formId} />;
};
