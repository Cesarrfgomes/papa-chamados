import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { hash } from 'bcrypt'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { UsernameAlreadyExistsError } from './errors/username-already-exists-error'
import { DepartmentRepository } from '@/repositories/department-repository'
import { NotFoundDepartmentError } from './errors/department-not-found-error'

interface CreateUserRequest {
	name: string
	username: string
	email: string
	password: string
	enterprise_id: string
	department_id: string
}
interface CreateUserResponse {
	user: User
}

export class CreateUserUseCase {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly departmentsRepository: DepartmentRepository
	) {}

	async execute({
		name,
		username,
		email,
		password,
		enterprise_id,
		department_id
	}: CreateUserRequest): Promise<CreateUserResponse> {
		const departmentExists =
			await this.departmentsRepository.findDepartmentById(department_id)

		console.log(departmentExists)

		const userWithSameEmail = await this.usersRepository.findUserByEmail(
			email
		)

		const userWithSameUsername =
			await this.usersRepository.findUserByUsername(username)

		if (userWithSameEmail) {
			throw new EmailAlreadyExistsError()
		}

		if (userWithSameUsername) {
			throw new UsernameAlreadyExistsError()
		}

		if (!departmentExists) {
			throw new NotFoundDepartmentError()
		}

		const password_hash = await hash(password, 6)

		const user = await this.usersRepository.create({
			name,
			email,
			enterprise_id,
			username,
			password_hash,
			department_id
		})

		return {
			user
		}
	}
}
