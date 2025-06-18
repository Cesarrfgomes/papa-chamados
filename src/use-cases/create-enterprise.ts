import { Enterprise, User } from '@prisma/client'
import { EnterprisesRepository } from '@/repositories/enterprises-repository'

interface CreateEnterpriseRequest {
	name: string
	cgcent: string
	latitude: number
	longitude: number
}
interface CreateEnterpriseResponse {
	enterprise: Enterprise
}

export class CreateEnterpriseUseCase {
	constructor(
		private readonly enterprisesRepository: EnterprisesRepository
	) {}

	async execute({
		name,
		cgcent,
		latitude,
		longitude
	}: CreateEnterpriseRequest): Promise<CreateEnterpriseResponse> {
		const enterprise = await this.enterprisesRepository.create({
			name,
			cgcent,
			latitude,
			longitude
		})

		return {
			enterprise
		}
	}
}
