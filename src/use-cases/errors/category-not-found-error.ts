export class NotFoundCategoryError extends Error {
	constructor() {
		super('Categoria não encontrada.')
	}
}
