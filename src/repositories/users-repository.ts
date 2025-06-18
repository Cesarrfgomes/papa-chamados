import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
	findUserByUsername(username: string): Promise<User | null>
	findUserByEmail(email: string): Promise<User | null>
	create(data: Prisma.UserUncheckedCreateInput): Promise<User>
}
