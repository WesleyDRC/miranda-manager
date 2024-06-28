export interface ITokenManager {
	generateToken(userId: string): string
}