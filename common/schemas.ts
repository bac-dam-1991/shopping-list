import Joi from 'joi';
import { Units } from './utils';

export const ShoppingListNameSchema = Joi.string()
	.min(2)
	.max(50)
	.required()
	.messages({
		'any.required': 'Shopping list name is required.',
		'string.min':
			'Shopping list name needs to be at least {#limit} characters long.',
		'string.max':
			'Shopping list name cannot be more than {#limit} characters long.',
		'string.empty': 'Shopping list name is required.',
	});

export const ShoppingListIdSchema = Joi.string()
	.length(24)
	.required()
	.messages({
		'string.length': 'Shopping list Id needs to be {#limit} characters long.',
		'any.required': 'Shopping list Id is required.',
	});

export const ItemIdSchema = Joi.string().length(24).required().messages({
	'string.length': 'Item Id needs to be {#limit} characters long.',
	'any.required': 'Item Id is required.',
});

export const ItemNameSchema = Joi.string().min(3).max(50).required().messages({
	'any.required': 'Item name is required.',
	'string.min': 'Item name needs to be at least {#limit} characters long.',
	'string.max': 'Item name cannot be more than {#limit} characters long.',
	'string.empty': 'Item name is required.',
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
	'number.base': 'Quantity must be a number.',
});

export const ItemUnitSchema = Joi.string()
	.valid(...Units)
	.required()
	.messages({
		'any.only': 'Invalid unit. Valid units are {#valids}.',
		'any.required': 'Item unit is required.',
	});
