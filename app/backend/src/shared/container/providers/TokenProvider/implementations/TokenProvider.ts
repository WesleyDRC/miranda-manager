import { ITokenProvider } from "../models/ITokenProvider";
import { sign } from "jsonwebtoken"

export class JwTProvider implements ITokenProvider {

	private secret: string;

	constructor() {
		this.secret = (process.env.APP_SECRET as string)
	}

	public generateToken(userId: string): string {
		return sign(userId, this.secret)
	}
}