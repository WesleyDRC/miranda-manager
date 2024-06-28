import { Request, Response } from "express";

import { SignInUseCase } from "../../../useCases/SignInUseCase";
import { container } from "tsyringe";

export class SignInController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const signInUseCase = container.resolve(SignInUseCase);

		const token = await signInUseCase.execute({email, password})

    return response.json({token});
  }
}
