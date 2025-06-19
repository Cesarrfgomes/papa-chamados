import { Prisma, Category } from '@prisma/client'

export interface CategoriesRepository {
	findCategoryById(id: string): Promise<Category | null>
	create(data: Prisma.CategoryCreateInput): Promise<Category>
}
