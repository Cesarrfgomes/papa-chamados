export class NotFoundEnterpriseError extends Error {
	constructor() {
		super('Empresa não encontrada.')
	}
}
