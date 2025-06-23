import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryTicketRepository } from '@/repositories/in-memory/in-memory-tickets-repository'
import { InMemoryEnterpriseRepository } from '@/repositories/in-memory/in-memory-enterprises-repository'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-category-repository'
import { hash } from 'bcrypt'
import { InMemoryDepartmentsRepository } from '@/repositories/in-memory/in-memory-department-repository'
import { UpdateTicketStatusUseCase } from './update-ticket-status'

let ticketsRepository: InMemoryTicketRepository
let usersRepository: InMemoryUsersRepository
let enterprisesRepository: InMemoryEnterpriseRepository
let categoriesRepository: InMemoryCategoriesRepository
let departmentsRepository: InMemoryDepartmentsRepository
let sut: UpdateTicketStatusUseCase

describe('Create Ticket', () => {
	beforeEach(() => {
		ticketsRepository = new InMemoryTicketRepository()
		usersRepository = new InMemoryUsersRepository()
		enterprisesRepository = new InMemoryEnterpriseRepository()
		categoriesRepository = new InMemoryCategoriesRepository()
		departmentsRepository = new InMemoryDepartmentsRepository()
		sut = new UpdateTicketStatusUseCase(ticketsRepository)
	})

	it('should be able to update a ticket status', async () => {
		const department = await departmentsRepository.create({
			name: 'TI'
		})

		const enterprise = await enterprisesRepository.create({
			name: 'Papa Materiais de Construção',
			cgcent: '40.536.646/0001-10',
			latitude: -12.2715191,
			longitude: -38.9611181
		})

		const user = await usersRepository.create({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password_hash: await hash('123456', 6),
			department_id: department.id,
			enterprise_id: 'enterprise-01'
		})

		const technician = await usersRepository.create({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password_hash: await hash('123456', 6),
			role: 'TECHNICIAN',
			department_id: department.id,
			enterprise_id: 'enterprise-01'
		})

		const category = await categoriesRepository.create({
			name: 'Teste'
		})

		const createTicket = await ticketsRepository.create({
			title: 'Ticket teste',
			description: 'Texto do ticket teste',
			priority: 'HIGH',
			category_id: category.id,
			enterprise_id: enterprise.id,
			department_id: department.id,
			user_id: user.id,
			technician_id: technician.id
		})

		console.log(createTicket)

		const { ticket } = await sut.execute({
			ticket_id: createTicket.id,
			status: 'RESOLVED'
		})

		console.log(ticket)

		expect(ticket.id).toEqual(expect.any(Number))
		expect(ticket.status).toEqual('RESOLVED')
	})
})
