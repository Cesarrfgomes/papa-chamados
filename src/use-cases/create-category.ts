import { Category } from '@prisma/client'
import { CategoriesRepository } from '@/repositories/categories-repository'

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
		const category = await this.categoriesRepository.create({
			name
		})

		return {
			category
		}
	}
}
