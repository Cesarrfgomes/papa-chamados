import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, expect, it, beforeEach } from 'vitest'
import { CreateUserUseCase } from './create-user'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { UsernameAlreadyExistsError } from './errors/username-already-exists-error'
import { InMemoryDepartmentsRepository } from '@/repositories/in-memory/in-memory-department-repository'

let usersRepository: InMemoryUsersRepository
let departmentsRepository: InMemoryDepartmentsRepository
let sut: CreateUserUseCase

describe('Create User', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		departmentsRepository = new InMemoryDepartmentsRepository()
		sut = new CreateUserUseCase(usersRepository, departmentsRepository)
	})

	it('should be able to create one user', async () => {
		const department = await departmentsRepository.create({
			name: 'TI'
		})

		const { user } = await sut.execute({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password: '123456',
			department_id: department.id,
			enterprise_id: 'enterprise-01'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be to create user with twice e-mail', async () => {
		const department = await departmentsRepository.create({
			name: 'TI'
		})

		await sut.execute({
			name: 'César',
			email: 'truvejano@minoxidil.com',
			username: 'pmc.cesar',
			password: '123456',
			enterprise_id: 'enterprise-01',
			department_id: department.id
		})

		await expect(() =>
			sut.execute({
				name: 'César',
				email: 'truvejano@minoxidil.com',
				username: 'pmc.cesar',
				password: '123456',
				enterprise_id: 'enterprise-01',
				department_id: 'department-01'
			})
		).rejects.instanceOf(EmailAlreadyExistsError)
	})

	it('should not be to create user with twice username', async () => {
		const department = await departmentsRepository.create({
			name: 'TI'
		})

		await sut.execute({
			name: 'César',
			email: 'truvejano1@minoxidil.com',
			username: 'pmc.cesar',
			password: '123456',
			enterprise_id: 'enterprise-01',
			department_id: department.id
		})

		await expect(() =>
			sut.execute({
				name: 'César',
				email: 'truvejano@minoxidil.com',
				username: 'pmc.cesar',
				password: '123456',
				enterprise_id: 'enterprise-01',
				department_id: 'department-01'
			})
		).rejects.instanceOf(UsernameAlreadyExistsError)
	})
})
