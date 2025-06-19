import { UsersRepository } from '@/repositories/users-repository'
import { Ticket } from '@prisma/client'
import { NotFoundUserError } from './errors/user-not-found-error'
import { TicketsRepository } from '@/repositories/tickets-repository'

interface FetchUserTicketsRequest {
	user_id: string
}

interface FetchUserTicketsResponse {
	ticket: Ticket[]
}

export class FetchUserTicketsUseCase {
	constructor(
		private readonly ticketsRepository: TicketsRepository,
		private readonly usersRepository: UsersRepository
	) {}

	async execute({
		user_id
	}: FetchUserTicketsRequest): Promise<FetchUserTicketsResponse> {
		const userExists = await this.usersRepository.findUserById(user_id)

		if (!userExists) {
			throw new NotFoundUserError()
		}

		const ticket = await this.ticketsRepository.findTicketByUserId(user_id)

		return {
			ticket
		}
	}
}
