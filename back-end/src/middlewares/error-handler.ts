import { ErrorRequestHandler } from 'express';
import { DuplicationError } from '../custom-errors/DuplicationError';
import { ResourceDoesNotExistError } from '../custom-errors/ResourceDoesNotExistError';
import { UpdateError } from '../custom-errors/UpdateError';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
	console.error({
		message: 'An error occurred',
		description: (error as Error).message,
	});
	if (error instanceof UpdateError) {
		res.status(400).json((error as Error).message);
		return;
	}
	if (error instanceof ResourceDoesNotExistError) {
		res.status(404).json((error as Error).message);
		return;
	}
	if (error instanceof DuplicationError) {
		res.status(409).json((error as Error).message);
		return;
	}
	res.status(500).json('An unknown error has occurred.');
};
