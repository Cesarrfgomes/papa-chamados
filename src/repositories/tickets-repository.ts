import { Prisma, Ticket } from '@prisma/client'

export interface TicketsRepository {
	findTicketById(id: number): Promise<Ticket | null>
	findManyUserTicketsByStatus(
		user_id: string,
		status: string
	): Promise<Ticket[]>
	findManyTicketsByUserId(user_id: string, page: number): Promise<Ticket[]>
	create(data: Prisma.TicketUncheckedCreateInput): Promise<Ticket>
}
