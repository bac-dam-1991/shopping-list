import { ErrorRequestHandler } from 'express';
import { ResourceDoesNotExistError } from '../custom-errors/ResourceDoesNotExistError';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
	console.error({
		message: 'An error occurred',
		description: (error as Error).message,
	});
	if (error instanceof ResourceDoesNotExistError) {
		res.status(404).json((error as Error).message);
		return;
	}
	res.status(500).json('An unknown error has occurred.');
};
