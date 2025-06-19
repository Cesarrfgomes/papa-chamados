import { Prisma, Enterprise } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { EnterprisesRepository } from '../enterprises-repository'

export class InMemoryEnterpriseRepository implements EnterprisesRepository {
	public enterprises: Enterprise[] = []

	async findEnterpriseById(id: string): Promise<Enterprise | null> {
		const enterprise = this.enterprises.find(item => item.id === id)

		if (!enterprise) {
			return null
		}

		return enterprise
	}

	async findEnterpriseByCgcent(cgcent: string): Promise<Enterprise | null> {
		const enterprise = this.enterprises.find(item => item.cgcent === cgcent)

		if (!enterprise) {
			return null
		}

		return enterprise
	}

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
