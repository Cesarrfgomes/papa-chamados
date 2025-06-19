import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryDepartmentsRepository } from '@/repositories/in-memory/in-memory-department-repository'
import { CreateDepartmentUseCase } from './create-department'
import { DepartmentAlreadyExistError } from './errors/department-already-exists-error'

let departmentRepository: InMemoryDepartmentsRepository
let sut: CreateDepartmentUseCase

describe('Create Category', () => {
	beforeEach(() => {
		departmentRepository = new InMemoryDepartmentsRepository()
		sut = new CreateDepartmentUseCase(departmentRepository)
	})

	it('should be able to create a category', async () => {
		const { department } = await sut.execute({
			name: 'Department Test'
		})

		expect(department.id).toEqual(expect.any(String))
	})

	it('should not be able to create a category with twice name', async () => {
		await sut.execute({
			name: 'Department Test'
		})

		await expect(() =>
			sut.execute({
				name: 'Department Test'
			})
		).rejects.instanceOf(DepartmentAlreadyExistError)
	})
})
