import {Request, Response} from "express"

import { AuthRepository } from "../../mongoose/repository/AuthRepository";

class SignUpController {
	public async handle(request: Request, response: Response):Promise<Response> {

		try {
			const { email, password } = request.body;

			const repo = new AuthRepository()

			const newUser = await repo.create({email, password})

			return response.json({ user: newUser });
		} catch (error) {
				console.error("Error creating user:", error);
				return response.status(500).json({ error: "Failed to create user" });
		}
	}
}

export default SignUpController