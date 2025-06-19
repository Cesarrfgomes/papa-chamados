import { Department, Prisma } from '@prisma/client'

export interface DepartmentRepository {
	findDepartmentById(id: string): Promise<Department | null>
	findDepartmentByName(name: string): Promise<Department | null>
	create(data: Prisma.DepartmentCreateInput): Promise<Department>
}
