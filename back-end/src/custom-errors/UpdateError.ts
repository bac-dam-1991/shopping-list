export class UpdateError extends Error {
	constructor(message?: string) {
		super(message || 'Unable to update document.');
	}
}
