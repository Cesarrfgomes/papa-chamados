import { Department, Prisma } from '@prisma/client'
import { DepartmentRepository } from '../department-repository'

export class InMemoryDepartmentsRepository implements DepartmentRepository {
	public departments: Department[] = []
	async findDepartmentById(id: string): Promise<Department | null> {
		throw new Error('Method not implemented.')
	}
	async findDepartmentByName(name: string): Promise<Department | null> {
		throw new Error('Method not implemented.')
	}
	async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
		throw new Error('Method not implemented.')
	}
}
