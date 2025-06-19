import { Department } from '@prisma/client'
import { DepartmentRepository } from '@/repositories/department-repository'
import { DepartmentAlreadyExistError } from './errors/department-already-exists-error'

interface CreateDepartmentRequest {
	name: string
}
interface CreateDepartmentResponse {
	department: Department
}

export class CreateDepartmentUseCase {
	constructor(private readonly departmentsRepository: DepartmentRepository) {}

	async execute({
		name
	}: CreateDepartmentRequest): Promise<CreateDepartmentResponse> {
		const searchDepartmentByName =
			await this.departmentsRepository.findDepartmentByName(name)

		if (searchDepartmentByName) {
			throw new DepartmentAlreadyExistError()
		}

		const department = await this.departmentsRepository.create({
			name
		})

		return {
			department
		}
	}
}
