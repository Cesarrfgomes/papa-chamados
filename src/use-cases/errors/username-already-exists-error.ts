export class UsernameAlreadyExistsError extends Error {
	constructor() {
		super('Username já está em uso.')
	}
}
