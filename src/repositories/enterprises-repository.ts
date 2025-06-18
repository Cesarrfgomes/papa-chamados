import { Prisma, Enterprise } from '@prisma/client'

export interface EnterprisesRepository {
	create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise>
}
