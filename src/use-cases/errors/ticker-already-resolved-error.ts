export class TickerAlreadyResolvedError extends Error {
	constructor() {
		super('O ticket já está concluído.')
	}
}
