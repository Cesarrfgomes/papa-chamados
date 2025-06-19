export class DepartmentAlreadyExistError extends Error {
	constructor() {
		super('O departamento já está cadastrado.')
	}
}
