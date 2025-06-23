import { Status, Ticket } from '@prisma/client'
import { TicketsRepository } from '@/repositories/tickets-repository'
import { NotFoundTicketError } from './errors/ticket-not-found-error'
import { TickerAlreadyResolvedError } from './errors/ticker-already-resolved-error'

interface UpdateTicketStatusRequest {
	ticket_id: number
	status: Status
}

interface UpdateTicketStatusResponse {
	ticket: Ticket
}

export class UpdateTicketStatusUseCase {
	constructor(private readonly ticketsRepository: TicketsRepository) {}

	async execute({
		ticket_id,
		status
	}: UpdateTicketStatusRequest): Promise<UpdateTicketStatusResponse> {
		const ticket = await this.ticketsRepository.findTicketById(ticket_id)

		if (!ticket) {
			throw new NotFoundTicketError()
		}

		if (ticket.status === 'RESOLVED') {
			throw new TickerAlreadyResolvedError()
		}

		ticket.status = status

		await this.ticketsRepository.save(ticket)

		return {
			ticket
		}
	}
}
