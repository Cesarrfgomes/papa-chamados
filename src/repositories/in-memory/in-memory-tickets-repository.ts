import { Prisma, Ticket } from '@prisma/client'
import { TicketsRepository } from '../tickets-repository'

export class InMemoryTicketRepository implements TicketsRepository {
	public tickets: Ticket[] = []

	async findTicketById(id: number): Promise<Ticket | null> {
		const ticket = this.tickets.find(item => item.id === id)

		if (!ticket) {
			return null
		}

		return ticket
	}

	async findManyTicketsByUserId(
		user_id: string,
		page: number
	): Promise<Ticket[]> {
		const tickets = this.tickets
			.filter(
				item =>
					item.user_id === user_id || item.technician_id === user_id
			)
			.slice((page - 1) * 20, page * 20)

		return tickets
	}

	async create(data: Prisma.TicketUncheckedCreateInput): Promise<Ticket> {
		const ticket = {
			id: this.tickets.length + 1,
			title: data.title,
			description: data.description,
			priority: data.priority ?? 'LOW',
			status: data.status ?? 'NEW',
			user_id: data.user_id,
			technician_id: data.technician_id,
			enterprise_id: data.enterprise_id,
			category_id: data.category_id,
			department_id: data.department_id,
			created_at: new Date(),
			updated_at: data.updated_at ? new Date(data.updated_at) : null
		}

		this.tickets.push(ticket)

		return ticket
	}

	async save(ticket: Ticket): Promise<Ticket> {
		const ticketInIndex = this.tickets.findIndex(
			item => item.id === ticket.id
		)

		if (ticketInIndex >= 0) {
			this.tickets[ticketInIndex] = ticket
		}

		return ticket
	}
}
