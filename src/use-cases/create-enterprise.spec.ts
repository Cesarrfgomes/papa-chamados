import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryEnterpriseRepository } from '@/repositories/in-memory/in-memory-enterprises-repository'
import { CreateEnterpriseUseCase } from './create-enterprise'
import { CgcentAlreadyExistError } from './errors/cgcent-already-exist-error'

let enterprisesRepository: InMemoryEnterpriseRepository
let sut: CreateEnterpriseUseCase

describe('Create Enterprise', () => {
	beforeEach(() => {
		enterprisesRepository = new InMemoryEnterpriseRepository()
		sut = new CreateEnterpriseUseCase(enterprisesRepository)
	})

	it('should be able to create a enterprise', async () => {
		const { enterprise } = await sut.execute({
			name: 'Papa Materiais de Construção',
			cgcent: '40.536.646/0001-10',
			latitude: -12.2715191,
			longitude: -38.9611181
		})

		expect(enterprise.id).toEqual(expect.any(String))
	})

	it('should not be able to create a enterprise with twice cgcent', async () => {
		await sut.execute({
			name: 'Papa Materiais de Construção',
			cgcent: '40.536.646/0001-10',
			latitude: -12.2715191,
			longitude: -38.9611181
		})

		await expect(() =>
			sut.execute({
				name: 'PMC Materiais de Construções',
				cgcent: '40.536.646/0001-10',
				latitude: -12.2715191,
				longitude: -38.9611181
			})
		).rejects.instanceOf(CgcentAlreadyExistError)
	})
})
