import { Prisma, Enterprise } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { EnterprisesRepository } from '../enterprises-repository'

export class InMemoryEnterpriseRepository implements EnterprisesRepository {
	public enterprises: Enterprise[] = []

	async create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise> {
		const enterprise = {
			id: randomUUID(),
			name: data.name,
			cgcent: data.cgcent,
			latitude: new Prisma.Decimal(data.latitude.toString()),
			longitude: new Prisma.Decimal(data.longitude.toString())
		}

		this.enterprises.push(enterprise)

		return enterprise
	}
}
