export class ResourceDoesNotExistError extends Error {
	constructor(message?: string) {
		super(message || 'Resource does not exist.');
	}
}
