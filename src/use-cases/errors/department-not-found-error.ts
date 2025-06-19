export class NotFoundDepartmentError extends Error {
	constructor() {
		super('Departamento não encontrado.')
	}
}
