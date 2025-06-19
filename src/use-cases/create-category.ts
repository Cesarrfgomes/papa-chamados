import { Category } from '@prisma/client'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error'

interface CreateCategoryRequest {
	name: string
}
interface CreateCategoryResponse {
	category: Category
}

export class CreateCategoryUseCase {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async execute({
		name
	}: CreateCategoryRequest): Promise<CreateCategoryResponse> {
		const searchCategoryByName =
			await this.categoriesRepository.findCategoryByName(name)

		if (searchCategoryByName) {
			throw new CategoryAlreadyExistsError()
		}

		const category = await this.categoriesRepository.create({
			name
		})

		return {
			category
		}
	}
}
