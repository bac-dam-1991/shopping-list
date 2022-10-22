import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { useState, ChangeEventHandler, FormEventHandler } from 'react';
import { addItemToShoppingListApi } from '../apis/shopping-lists';

export const Units = [
	'piece(s)',
	'kilogram(s)',
	'litre(s)',
	'box(es)',
	'millilitre(s)',
	'milligram(s)',
	'carton(s)',
	'bottle(s)',
];

export const Statuses = ['New', 'Updated', 'Purchased'];

export interface NewShoppingItemFormProps {
	refetch: () => Promise<void>;
	shoppingListId: string;
}

export const NewShoppingItemForm = ({
	refetch,
	shoppingListId,
}: NewShoppingItemFormProps) => {
	const [name, setName] = useState<string>('');
	const [quantity, setQuantity] = useState<number>(0);
	const [unit, setUnit] = useState<string>('');

	const submitForm: FormEventHandler = async (event) => {
		event.preventDefault();
		await addItemToShoppingListApi(shoppingListId, { name, unit, quantity });
		await refetch();
		setName('');
		setQuantity(0);
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
				<Button variant="contained" type="submit">
					Add
				</Button>
			</Stack>
		</form>
	);
};
