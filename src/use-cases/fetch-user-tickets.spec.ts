import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, expect, it, beforeEach } from 'vitest'
import { CreateUserUseCase } from './create-user'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { UsernameAlreadyExistsError } from './errors/username-already-exists-error'
import { InMemoryTicketRepository } from '@/repositories/in-memory/in-memory-tickets-repository'
import { FetchUserTicketsUseCase } from './fetch-user-tickets'
import { hash } from 'bcrypt'
import { InMemoryEnterpriseRepository } from '@/repositories/in-memory/in-memory-category-repository'

let ticketsRepository: InMemoryTicketRepository
let usersRepository: InMemoryUsersRepository
let enterprisesRepository: InMemoryEnterpriseRepository
let sut: FetchUserTicketsUseCase

describe('Fetch User tickets', () => {
	beforeEach(() => {
		ticketsRepository = new InMemoryTicketRepository()
		usersRepository = new InMemoryUsersRepository()
		enterprisesRepository = new InMemoryEnterpriseRepository()
		sut = new FetchUserTicketsUseCase(ticketsRepository, usersRepository)
	})

	it('should be able to get a list of tickets by user_id', async () => {
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
			enterprise_id: enterprise.id
		})

		await ticketsRepository.create({
			title: 'Ticket teste',
			description: 'Texto do ticket teste',
			category_id: 'category-01',
			priority: 'HIGH',
			enterprise_id: enterprise.id,
			user_id: user.id
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

		const user = await usersRepository.create({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password_hash: await hash('123456', 6),
			enterprise_id: enterprise.id
		})

		for (let i = 0; i < 22; i++) {
			await ticketsRepository.create({
				title: `Ticket teste ${i}`,
				description: 'Texto do ticket teste',
				category_id: 'category-01',
				priority: 'HIGH',
				enterprise_id: enterprise.id,
				user_id: user.id
			})
		}

		const { tickets } = await sut.execute({ user_id: user.id, page: 2 })

		expect(tickets).toHaveLength(2)
	})
})
