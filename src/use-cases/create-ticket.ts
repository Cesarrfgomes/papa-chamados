import { UsersRepository } from '@/repositories/users-repository'
import { Priority, Ticket } from '@prisma/client'
import { NotFoundUserError } from './errors/user-not-found-error'
import { EnterprisesRepository } from '@/repositories/enterprises-repository'
import { NotFoundEnterpriseError } from './errors/enterprise-not-found-error'
import { TicketsRepository } from '@/repositories/tickets-repository'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { NotFoundCategoryError } from './errors/category-not-found-error'
import { DepartmentRepository } from '@/repositories/department-repository'
import { NotFoundDepartmentError } from './errors/department-not-found-error'
import { IsNotTechnicianError } from './errors/user-not-technician-error'

interface CreateTicketRequest {
	title: string
	description: string
	user_id: string
	technician_id: string
	enterprise_id: string
	priority: Priority
	category_id: string
	department_id: string
}

interface CreateTicketResponse {
	ticket: Ticket
}

export class CreateTicketUseCase {
	constructor(
		private readonly ticketsRepository: TicketsRepository,
		private readonly usersRepository: UsersRepository,
		private readonly enterprisesRepository: EnterprisesRepository,
		private readonly categoriesRepository: CategoriesRepository,
		private readonly departmentRepository: DepartmentRepository
	) {}

	async execute({
		title,
		description,
		priority,
		user_id,
		technician_id,
		category_id,
		enterprise_id,
		department_id
	}: CreateTicketRequest): Promise<CreateTicketResponse> {
		const isTechnicianUser = await this.usersRepository.findUserById(
			technician_id
		)

		const userExists = await this.usersRepository.findUserById(user_id)

		const enterpriseExists =
			await this.enterprisesRepository.findEnterpriseById(enterprise_id)

		const categoryExists = await this.categoriesRepository.findCategoryById(
			category_id
		)

		const departmentExists =
			await this.departmentRepository.findDepartmentById(department_id)

		if (!userExists) {
			throw new NotFoundUserError()
		}

		if (!isTechnicianUser) {
			throw new NotFoundUserError()
		}

		if (isTechnicianUser.role === 'USER') {
			throw new IsNotTechnicianError()
		}

		if (!enterpriseExists) {
			throw new NotFoundEnterpriseError()
		}

		if (!categoryExists) {
			throw new NotFoundCategoryError()
		}

		if (!departmentExists) {
			throw new NotFoundDepartmentError()
		}

		const ticket = await this.ticketsRepository.create({
			title,
			description,
			priority,
			user_id,
			technician_id,
			category_id,
			enterprise_id,
			department_id
		})

		return {
			ticket
		}
	}
}
