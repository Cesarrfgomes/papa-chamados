import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryTicketRepository } from '@/repositories/in-memory/in-memory-tickets-repository'
import { FetchUserTicketsUseCase } from './fetch-user-tickets'
import { hash } from 'bcrypt'
import { InMemoryEnterpriseRepository } from '@/repositories/in-memory/in-memory-enterprises-repository'
import { InMemoryDepartmentsRepository } from '@/repositories/in-memory/in-memory-department-repository'

let ticketsRepository: InMemoryTicketRepository
let usersRepository: InMemoryUsersRepository
let enterprisesRepository: InMemoryEnterpriseRepository
let departmentsRepository: InMemoryDepartmentsRepository
let sut: FetchUserTicketsUseCase

describe('Fetch User tickets', () => {
	beforeEach(() => {
		ticketsRepository = new InMemoryTicketRepository()
		usersRepository = new InMemoryUsersRepository()
		enterprisesRepository = new InMemoryEnterpriseRepository()
		departmentsRepository = new InMemoryDepartmentsRepository()
		sut = new FetchUserTicketsUseCase(ticketsRepository, usersRepository)
	})

	it('should be able to get a list of tickets by user_id', async () => {
		const enterprise = await enterprisesRepository.create({
			name: 'Papa Materiais de Construção',
			cgcent: '40.536.646/0001-10',
			latitude: -12.2715191,
			longitude: -38.9611181
		})

		const department = await departmentsRepository.create({
			name: 'TI'
		})

		const user = await usersRepository.create({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password_hash: await hash('123456', 6),
			department_id: department.id,
			enterprise_id: enterprise.id
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

		await ticketsRepository.create({
			title: 'Ticket teste',
			description: 'Texto do ticket teste',
			category_id: 'category-01',
			priority: 'HIGH',
			enterprise_id: enterprise.id,
			department_id: department.id,
			user_id: user.id,
			technician_id: technician.id
		})

		const { tickets } = await sut.execute({ user_id: user.id, page: 1 })

		expect(tickets).toHaveLength(1)
	})

	it('should be able to get a paginated list of tickets by user_id', async () => {
		const enterprise = await enterprisesRepository.create({
			name: 'Papa Materiais de Construção',
			cgcent: '40.536.646/0001-10',
			latitude: -12.2715191,
			longitude: -38.9611181
		})

		const department = await departmentsRepository.create({
			name: 'TI'
		})

		const user = await usersRepository.create({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password_hash: await hash('123456', 6),
			enterprise_id: enterprise.id,
			department_id: department.id
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

		for (let i = 0; i < 22; i++) {
			await ticketsRepository.create({
				title: `Ticket teste ${i}`,
				description: 'Texto do ticket teste',
				category_id: 'category-01',
				priority: 'HIGH',
				enterprise_id: enterprise.id,
				department_id: department.id,
				user_id: user.id,
				technician_id: technician.id
			})
		}

		const { tickets } = await sut.execute({ user_id: user.id, page: 2 })

		expect(tickets).toHaveLength(2)
	})
})
