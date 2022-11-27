import Joi from 'joi';
import { Units } from '../../repositories/shopping-lists';

export const ShoppingListIdSchema = Joi.string().length(24).messages({
	'string.length': 'Shopping list Id needs to be {#limit} characters long.',
});
export const ShoppingListNameSchema = Joi.string()
	.min(3)
	.max(50)
	.required()
	.messages({
		'any.required': 'Shopping list name is required.',
		'string.min':
			'Shopping list name needs to be at least {#limit} characters long.',
		'string.max':
			'Shopping list name cannot be more than {#limit} characters long.',
	});
export const ItemNameSchema = Joi.string().min(3).max(50).required().messages({
	'any.required': 'Item name is required.',
	'string.min': 'Item name needs to be at least {#limit} characters long.',
	'string.max': 'Item name cannot be more than {#limit} characters long.',
});
export const ItemStatusSchema = Joi.string()
	.valid('New', 'Updated', 'Purchased')
	.required()
	.messages({
		'any.only': 'Invalid status. Valid statuses are {#valids}.',
		'any.required': 'Item status is required.',
	});
export const ItemQuantitySchema = Joi.number().min(0).required().messages({
	'number.min': 'Quantity cannot be less than {#limit}.',
	'any.required': 'Item quantity is required.',
});
export const ItemUnitSchema = Joi.string()
	.valid(...Units)
	.required()
	.messages({
		'any.only': 'Invalid unit. Valid units are {#valids}.',
		'any.required': 'Item unit is required.',
	});
