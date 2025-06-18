export class EmailAlreadyExistsError extends Error {
	constructor() {
		super('Email já está em uso.')
	}
}
