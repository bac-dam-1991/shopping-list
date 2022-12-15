import { Grid, MenuItem, Stack, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Units, Statuses } from '@common/utils';
import {
	ItemNameSchema,
	ItemQuantitySchema,
	ItemStatusSchema,
	ItemUnitSchema,
} from '@common/schemas';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';

const Schema = Joi.object().keys({
	name: ItemNameSchema,
	quantity: ItemQuantitySchema,
	status: ItemStatusSchema,
	unit: ItemUnitSchema,
});

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
	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<ShoppingItemFormFields>({
		defaultValues,
		resolver: joiResolver(Schema),
	});

	const onSubmit = async (formValues: ShoppingItemFormFields) => {
		await submitForm(formValues);
		reset();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} id={formId}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<TextField
						label="Name"
						{...register('name')}
						autoFocus
						helperText={errors.name?.message}
						error={Boolean(errors.name?.message)}
						size="small"
						fullWidth
					/>
				</Grid>
				<Grid item xs={6} md={4}>
					<TextField
						label="Quantity"
						type="number"
						fullWidth
						{...register('quantity', { valueAsNumber: true })}
						helperText={errors.quantity?.message}
						error={Boolean(errors.quantity?.message)}
						size="small"
					/>
				</Grid>
				<Grid item xs={6} md={4}>
					<Controller
						control={control}
						name="unit"
						render={({ field }) => {
							return (
								<TextField
									fullWidth
									select
									label="Unit"
									{...field}
									helperText={errors.unit?.message}
									error={Boolean(errors.unit?.message)}
									size="small"
								>
									{[...Units].sort().map((unit) => {
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
				</Grid>
				<Grid item xs={12} md={4}>
					<Controller
						control={control}
						name="status"
						render={({ field }) => {
							return (
								<TextField
									fullWidth
									select
									label="Status"
									{...field}
									helperText={errors.status?.message}
									error={Boolean(errors.status?.message)}
									size="small"
								>
									{[...Statuses].sort().map((status) => {
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
				</Grid>
			</Grid>
		</form>
	);
};
