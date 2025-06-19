import { describe, expect, it, beforeEach } from 'vitest'
import { CreateTicketUseCase } from './create-ticket'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryTicketRepository } from '@/repositories/in-memory/in-memory-tickets-repository'
import { InMemoryEnterpriseRepository } from '@/repositories/in-memory/in-memory-enterprises-repository'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-category-repository'
import { NotFoundUserError } from './errors/user-not-found-error'
import { NotFoundEnterpriseError } from './errors/enterprise-not-found-error'
import { hash } from 'bcrypt'
import { NotFoundCategoryError } from './errors/category-not-found-error'
import { InMemoryDepartmentsRepository } from '@/repositories/in-memory/in-memory-department-repository'
import { NotFoundDepartmentError } from './errors/department-not-found-error'

let ticketsRepository: InMemoryTicketRepository
let usersRepository: InMemoryUsersRepository
let enterprisesRepository: InMemoryEnterpriseRepository
let categoriesRepository: InMemoryCategoriesRepository
let departmentsRepository: InMemoryDepartmentsRepository
let sut: CreateTicketUseCase

describe('Create Ticket', () => {
	beforeEach(() => {
		ticketsRepository = new InMemoryTicketRepository()
		usersRepository = new InMemoryUsersRepository()
		enterprisesRepository = new InMemoryEnterpriseRepository()
		categoriesRepository = new InMemoryCategoriesRepository()
		departmentsRepository = new InMemoryDepartmentsRepository()
		sut = new CreateTicketUseCase(
			ticketsRepository,
			usersRepository,
			enterprisesRepository,
			categoriesRepository,
			departmentsRepository
		)
	})

	it('should be able to create a ticket', async () => {
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

		const category = await categoriesRepository.create({
			name: 'Teste'
		})

		const { ticket } = await sut.execute({
			title: 'Ticket teste',
			description: 'Texto do ticket teste',
			priority: 'HIGH',
			category_id: category.id,
			enterprise_id: enterprise.id,
			department_id: department.id,
			user_id: user.id
		})

		expect(ticket.id).toEqual(expect.any(Number))
		expect(ticket.priority).toEqual('HIGH')
	})

	it('should not be able to create a ticket with inexistent user', async () => {
		const enterprise = await enterprisesRepository.create({
			name: 'Papa Materiais de Construção',
			cgcent: '40.536.646/0001-10',
			latitude: -12.2715191,
			longitude: -38.9611181
		})

		const category = await categoriesRepository.create({
			name: 'Teste'
		})

		const department = await departmentsRepository.create({
			name: 'TI'
		})

		await expect(() =>
			sut.execute({
				title: 'Ticket teste',
				description: 'Texto do ticket teste',
				category_id: category.id,
				priority: 'HIGH',
				enterprise_id: enterprise.id,
				department_id: department.id,
				user_id: 'user.id'
			})
		).rejects.instanceOf(NotFoundUserError)
	})

	it('should not be able to create a ticket with inexistent enterprise', async () => {
		const department = await departmentsRepository.create({
			name: 'TI'
		})

		const user = await usersRepository.create({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password_hash: await hash('123456', 6),
			department_id: department.id,
			enterprise_id: 'enterprise-01'
		})

		const category = await categoriesRepository.create({
			name: 'Teste'
		})

		await expect(() =>
			sut.execute({
				title: 'Ticket teste',
				description: 'Texto do ticket teste',
				category_id: category.id,
				priority: 'HIGH',
				enterprise_id: 'enterprise.id',
				department_id: department.id,
				user_id: user.id
			})
		).rejects.instanceOf(NotFoundEnterpriseError)
	})

	it('should not be able to create a ticket with inexistent category', async () => {
		const department = await departmentsRepository.create({
			name: 'TI'
		})

		const user = await usersRepository.create({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password_hash: await hash('123456', 6),
			department_id: department.id,
			enterprise_id: 'enterprise-01'
		})

		const enterprise = await enterprisesRepository.create({
			name: 'Papa Materiais de Construção',
			cgcent: '40.536.646/0001-10',
			latitude: -12.2715191,
			longitude: -38.9611181
		})

		await expect(() =>
			sut.execute({
				title: 'Ticket teste',
				description: 'Texto do ticket teste',
				category_id: 'category.id',
				priority: 'HIGH',
				enterprise_id: enterprise.id,
				department_id: department.id,
				user_id: user.id
			})
		).rejects.instanceOf(NotFoundCategoryError)
	})

	it('should not be able to create a ticket with inexistent department', async () => {
		const user = await usersRepository.create({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password_hash: await hash('123456', 6),
			department_id: 'department.id',
			enterprise_id: 'enterprise-01'
		})

		const enterprise = await enterprisesRepository.create({
			name: 'Papa Materiais de Construção',
			cgcent: '40.536.646/0001-10',
			latitude: -12.2715191,
			longitude: -38.9611181
		})

		const category = await categoriesRepository.create({
			name: 'Teste'
		})

		await expect(() =>
			sut.execute({
				title: 'Ticket teste',
				description: 'Texto do ticket teste',
				category_id: category.id,
				priority: 'HIGH',
				enterprise_id: enterprise.id,
				department_id: 'department.id',
				user_id: user.id
			})
		).rejects.instanceOf(NotFoundDepartmentError)
	})
})
