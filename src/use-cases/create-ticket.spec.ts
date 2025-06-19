import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryTicketRepository } from '@/repositories/in-memory/in-memory-tickets-repository'
import { CreateTicketUseCase } from './create-ticket'
import { InMemoryEnterpriseRepository } from '@/repositories/in-memory/in-memory-enterprises-repository'
import { hash } from 'bcrypt'
import { NotFoundUserError } from './errors/user-not-found-error'
import { NotFoundEnterpriseError } from './errors/enterprise-not-found-error'

let ticketsRepository: InMemoryTicketRepository
let usersRepository: InMemoryUsersRepository
let enterprisesRepository: InMemoryEnterpriseRepository
let sut: CreateTicketUseCase

describe('Create Ticket', () => {
	beforeEach(() => {
		ticketsRepository = new InMemoryTicketRepository()
		usersRepository = new InMemoryUsersRepository()
		enterprisesRepository = new InMemoryEnterpriseRepository()
		sut = new CreateTicketUseCase(
			ticketsRepository,
			usersRepository,
			enterprisesRepository
		)
	})

	it('should be able to create a ticket', async () => {
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
			enterprise_id: 'enterprise-01'
		})

		const { ticket } = await sut.execute({
			title: 'Ticket teste',
			description: 'Texto do ticket teste',
			category_id: 'category-01',
			priority: 'HIGH',
			enterprise_id: enterprise.id,
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

		const user = await usersRepository.create({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password_hash: await hash('123456', 6),
			enterprise_id: 'enterprise-01'
		})

		await expect(() =>
			sut.execute({
				title: 'Ticket teste',
				description: 'Texto do ticket teste',
				category_id: 'category-01',
				priority: 'HIGH',
				enterprise_id: enterprise.id,
				user_id: 'user.id'
			})
		).rejects.instanceOf(NotFoundUserError)
	})

	it('should not be able to create a ticket with inexistent enterprise', async () => {
		const user = await usersRepository.create({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password_hash: await hash('123456', 6),
			enterprise_id: 'enterprise-01'
		})

		await expect(() =>
			sut.execute({
				title: 'Ticket teste',
				description: 'Texto do ticket teste',
				category_id: 'category-01',
				priority: 'HIGH',
				enterprise_id: 'enterprise.id',
				user_id: user.id
			})
		).rejects.instanceOf(NotFoundEnterpriseError)
	})
})
