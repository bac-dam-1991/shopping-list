import Joi from 'joi';
import { ValidationError } from '../custom-errors/ValidationError';

export const validateAndThrowOnError = (
	schema: Joi.Schema,
	payload: Object
) => {
	const { error } = schema.validate(payload);
	if (error) {
		throw new ValidationError(error.details[0].message);
	}
};
