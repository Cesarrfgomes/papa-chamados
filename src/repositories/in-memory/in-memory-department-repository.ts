import { Department, Prisma } from '@prisma/client'
import { DepartmentRepository } from '../department-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryDepartmentsRepository implements DepartmentRepository {
	public departments: Department[] = []

	async findDepartmentById(id: string): Promise<Department | null> {
		const department = this.departments.find(item => item.id === id)

		if (!department) {
			return null
		}

		return department
	}

	async findDepartmentByName(name: string): Promise<Department | null> {
		const department = this.departments.find(item => item.name === name)

		if (!department) {
			return null
		}

		return department
	}
	async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
		const department = {
			id: randomUUID(),
			name: data.name
		}

		this.departments.push(department)

		return department
	}
}
