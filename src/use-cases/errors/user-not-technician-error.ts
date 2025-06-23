export class IsNotTechnicianError extends Error {
	constructor() {
		super('O usuário não é um técnico.')
	}
}
