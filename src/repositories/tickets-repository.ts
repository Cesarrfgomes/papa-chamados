import { Prisma, Ticket } from '@prisma/client'

export interface TicketsRepository {
	findTicketById(id: number): Promise<Ticket | null>
	findTicketByUserId(user_id: string): Promise<Ticket[]>
	create(data: Prisma.TicketUncheckedCreateInput): Promise<Ticket>
}
