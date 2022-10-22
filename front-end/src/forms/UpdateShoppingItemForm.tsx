import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { useState, ChangeEventHandler, FormEventHandler } from 'react';
import { ShoppingItem, updateShoppingItemApi } from '../apis/shopping-lists';
import { Statuses, Units } from './NewShoppingItemForm';

export interface UpdateShoppingItemFormProps {
	refetch: () => Promise<void>;
	shoppingListId: string;
	data: ShoppingItem;
	closeForm: () => void;
}

export const UpdateShoppingItemForm = ({
	refetch,
	shoppingListId,
	data,
	closeForm,
}: UpdateShoppingItemFormProps) => {
	const [name, setName] = useState<string>(data.name);
	const [quantity, setQuantity] = useState<number>(data.quantity);
	const [unit, setUnit] = useState<string>(data.unit);
	const [status, setStatus] = useState<string>(data.status);

	const submitForm: FormEventHandler = async (event) => {
		event.preventDefault();
		await updateShoppingItemApi(shoppingListId, {
			id: data.id,
			name,
			unit,
			quantity,
			status,
		});
		await refetch();
		closeForm();
	};

	const handleNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const val = event.target.value;
		setName(val);
	};

	const handleQuantityChange: ChangeEventHandler<HTMLInputElement> = (
		event
	) => {
		const val = event.target.valueAsNumber;
		setQuantity(val);
	};

	const handleUnitChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const val = event.target.value;
		setUnit(val);
	};

	const handleStatusChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const val = event.target.value;
		setStatus(val);
	};

	return (
		<form onSubmit={submitForm}>
			<Stack spacing={2}>
				<TextField label="Name" value={name} onChange={handleNameChange} />
				<TextField
					label="Quantity"
					type="number"
					value={quantity}
					onChange={handleQuantityChange}
				/>
				<TextField select label="Unit" value={unit} onChange={handleUnitChange}>
					{Units.sort().map((unit) => {
						return (
							<MenuItem key={unit} value={unit}>
								{unit}
							</MenuItem>
						);
					})}
				</TextField>
				<TextField
					select
					label="Status"
					value={status}
					onChange={handleStatusChange}
				>
					{Statuses.sort().map((status) => {
						return (
							<MenuItem key={status} value={status}>
								{status}
							</MenuItem>
						);
					})}
				</TextField>
				<Button variant="contained" type="submit">
					Update
				</Button>
			</Stack>
		</form>
	);
};
