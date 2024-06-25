	import {Request, Response} from "express"

	class SignUpController {
		public async handle(request: Request, response: Response):Promise<Response> {
			
			const { email, password, confirmPassword } = request.body

			return response.json({ user: "created"})
		}
	}

	export default SignUpController