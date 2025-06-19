import { Prisma, Enterprise } from '@prisma/client'

export interface EnterprisesRepository {
	findEnterpriseById(id: string): Promise<Enterprise | null>
	findEnterpriseByCgcent(cgcent: string): Promise<Enterprise | null>
	create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise>
}
