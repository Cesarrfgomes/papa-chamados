import { UsersRepository } from '@/repositories/users-repository'
import { Ticket } from '@prisma/client'
import { NotFoundUserError } from './errors/user-not-found-error'
import { TicketsRepository } from '@/repositories/tickets-repository'

interface FetchUserTicketsRequest {
	user_id: string
	page: number
}

interface FetchUserTicketsResponse {
	tickets: Ticket[]
}

export class FetchUserTicketsUseCase {
	constructor(
		private readonly ticketsRepository: TicketsRepository,
		private readonly usersRepository: UsersRepository
	) {}

	async execute({
		user_id,
		page
	}: FetchUserTicketsRequest): Promise<FetchUserTicketsResponse> {
		const userExists = await this.usersRepository.findUserById(user_id)

		if (!userExists) {
			throw new NotFoundUserError()
		}

		const tickets = await this.ticketsRepository.findManyTicketsByUserId(
			user_id,
			page
		)

		return {
			tickets
		}
	}
}
