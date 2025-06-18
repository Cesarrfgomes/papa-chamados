import { Prisma, Ticket } from '@prisma/client'

export interface TicketsRepository {
	create(data: Prisma.TicketUncheckedCreateInput): Promise<Ticket>
}
