import { Prisma, Ticket } from '@prisma/client'

export interface TicketsRepository {
	findTicketById(id: number): Promise<Ticket | null>
	findManyTicketsByUserId(user_id: string, page: number): Promise<Ticket[]>
	create(data: Prisma.TicketUncheckedCreateInput): Promise<Ticket>
	save(ticket: Ticket): Promise<Ticket>
}
