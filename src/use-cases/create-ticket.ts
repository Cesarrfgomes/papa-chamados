import { UsersRepository } from '@/repositories/users-repository'
import { Priority, Prisma, Ticket } from '@prisma/client'
import { NotFoundUserError } from './errors/user-not-found-error'
import { EnterprisesRepository } from '@/repositories/enterprises-repository'
import { NotFoundEnterpriseError } from './errors/enterprise-not-found-error'
import { TicketsRepository } from '@/repositories/tickets-repository'

interface CreateTicketRequest {
	title: string
	description: string
	user_id: string
	priority: Priority
	enterprise_id: string
	category_id: string
}

interface CreateTicketResponse {
	ticket: Ticket
}

export class CreateTicketUseCase {
	constructor(
		private readonly ticketsRepository: TicketsRepository,
		private readonly usersRepository: UsersRepository,
		private readonly enterprisesRepository: EnterprisesRepository
	) {}

	async execute({
		title,
		description,
		priority,
		user_id,
		category_id,
		enterprise_id
	}: CreateTicketRequest): Promise<CreateTicketResponse> {
		const userExists = await this.usersRepository.findUserById(user_id)

		const enterpriseExists =
			await this.enterprisesRepository.findEnterpriseById(enterprise_id)

		if (!userExists) {
			throw new NotFoundUserError()
		}

		if (!enterpriseExists) {
			throw new NotFoundEnterpriseError()
		}

		const ticket = await this.ticketsRepository.create({
			title,
			description,
			priority,
			user_id,
			category_id,
			enterprise_id
		})

		return {
			ticket
		}
	}
}
