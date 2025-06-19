import { Prisma, Ticket } from '@prisma/client'
import { randomInt } from 'node:crypto'
import { TicketsRepository } from '../tickets-repository'

export class InMemoryTicketRepository implements TicketsRepository {
	public tickets: Ticket[] = []

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
