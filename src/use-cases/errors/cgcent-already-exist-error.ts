export class CgcentAlreadyExistError extends Error {
	constructor() {
		super('CNPJ já está em uso.')
	}
}
