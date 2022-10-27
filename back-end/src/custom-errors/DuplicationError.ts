export class DuplicationError extends Error {
	constructor(message?: string) {
		super(message || 'Resource already exists.');
	}
}
