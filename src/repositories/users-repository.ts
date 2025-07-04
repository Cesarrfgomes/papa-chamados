import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
	findUserById(id: string): Promise<User | null>
	findUserByUsername(username: string): Promise<User | null>
	findUserByEmail(email: string): Promise<User | null>
	create(data: Prisma.UserUncheckedCreateInput): Promise<User>
}
