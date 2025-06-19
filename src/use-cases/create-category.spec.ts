import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryCategoryRepository } from '@/repositories/in-memory/in-memory-category-repository'
import { CreateCategoryUseCase } from './create-category'
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error'

let categoryRepository: InMemoryCategoryRepository
let sut: CreateCategoryUseCase

describe('Create Category', () => {
	beforeEach(() => {
		categoryRepository = new InMemoryCategoryRepository()
		sut = new CreateCategoryUseCase(categoryRepository)
	})

	it('should be able to create a category', async () => {
		const { category } = await sut.execute({
			name: 'Software'
		})

		expect(category.id).toEqual(expect.any(String))
	})

	it('should not be able to create a category with twice name', async () => {
		await sut.execute({
			name: 'Software'
		})

		await expect(() =>
			sut.execute({
				name: 'Software'
			})
		).rejects.instanceOf(CategoryAlreadyExistsError)
	})
})
