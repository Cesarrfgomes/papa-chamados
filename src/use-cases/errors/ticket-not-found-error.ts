export class NotFoundTicketError extends Error {
	constructor() {
		super('Ticket não encontrado.')
	}
}
