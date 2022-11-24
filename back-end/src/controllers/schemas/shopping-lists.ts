import Joi from 'joi';

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
