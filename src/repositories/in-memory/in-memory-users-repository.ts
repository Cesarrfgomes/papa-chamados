import { User, Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
	public users: User[] = []

	async findUserByEmail(email: string): Promise<User | null> {
		const user = this.users.find(item => {
			return item.email === email
		})

		if (!user) {
			return null
		}

		return user
	}

	async findUserByUsername(username: string): Promise<User | null> {
		const user = this.users.find(item => item.username === username)

		if (!user) {
			return null
		}

		return user
	}

	async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
		const user = {
			id: randomUUID(),
			name: data.name,
			username: data.username,
			email: data.email,
			password_hash: data.password_hash,
			phone: data.phone ?? null,
			enterprise_id: data.enterprise_id,
			role: data.role ?? 'USER',
			isActive: data.isActive ?? true,
			created_at: new Date()
		}

		this.users.push(user)

		return user
	}
}
