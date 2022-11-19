import { MenuItem, Stack, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

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

export const ShoppingItemFormId = 'shopping-item-form-id';

export interface ShoppingItemFormFields {
	name: string;
	quantity: number;
	unit: string;
	status: string;
}

export interface ShoppingItemFormProps {
	defaultValues?: ShoppingItemFormFields;
	submitForm: (formValues: ShoppingItemFormFields) => Promise<void>;
	formId?: string;
}

export const ShoppingItemForm = ({
	defaultValues = { name: '', quantity: 1, unit: 'piece(s)', status: 'New' },
	submitForm,
	formId,
}: ShoppingItemFormProps) => {
	const { register, handleSubmit, reset, control } =
		useForm<ShoppingItemFormFields>({
			defaultValues,
		});

	const onSubmit = async (formValues: ShoppingItemFormFields) => {
		await submitForm(formValues);
		reset();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} id={formId}>
			<Stack spacing={2}>
				<TextField label="Name" {...register('name')} autoFocus />
				<TextField label="Quantity" type="number" {...register('quantity')} />
				<Controller
					control={control}
					name="unit"
					render={({ field }) => {
						return (
							<TextField select label="Unit" {...field}>
								{Units.sort().map((unit) => {
									return (
										<MenuItem key={unit} value={unit}>
											{unit}
										</MenuItem>
									);
								})}
							</TextField>
						);
					}}
				/>
				<Controller
					control={control}
					name="status"
					render={({ field }) => {
						return (
							<TextField select label="Status" {...field}>
								{Statuses.sort().map((status) => {
									return (
										<MenuItem key={status} value={status}>
											{status}
										</MenuItem>
									);
								})}
							</TextField>
						);
					}}
				/>
			</Stack>
		</form>
	);
};
