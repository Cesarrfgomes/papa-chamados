import { Prisma, Category } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CategoriesRepository } from '../categories-repository'

export class InMemoryCategoryRepository implements CategoriesRepository {
	public categories: Category[] = []

	async findCategoryById(id: string): Promise<Category | null> {
		const category = this.categories.find(item => item.id === id)

		if (!category) {
			return null
		}

		return category
	}

	async create(data: Prisma.CategoryCreateInput): Promise<Category> {
		const category = {
			id: randomUUID(),
			name: data.name
		}

		this.categories.push(category)

		return category
	}
}
