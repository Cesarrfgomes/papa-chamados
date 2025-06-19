import { Prisma, Ticket } from '@prisma/client'
import { randomInt } from 'node:crypto'
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

	async findTicketByUserId(user_id: string): Promise<Ticket[]> {
		const tickets = this.tickets.filter(item => item.user_id === user_id)

		return tickets
	}

	async create(data: Prisma.TicketUncheckedCreateInput): Promise<Ticket> {
		const ticket = {
			id: randomInt(1, 20),
			title: data.title,
			description: data.description,
			priority: data.priority ?? 'LOW',
			status: data.status ?? 'NEW',
			user_id: data.user_id,
			enterprise_id: data.enterprise_id,
			category_id: data.category_id,
			created_at: new Date(),
			updated_at: data.updated_at ? new Date(data.updated_at) : null
		}

		this.tickets.push(ticket)

		return ticket
	}
}
