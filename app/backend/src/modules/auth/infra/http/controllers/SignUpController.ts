import { Request, Response } from "express";

import { SignUpUseCase } from "../../../useCases/SignUpUseCase";

import { container } from "tsyringe";

export class SignUpController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { email, password, confirmPassword } = request.body;

    const signUpUseCase = container.resolve(SignUpUseCase);

    const token = await signUpUseCase.execute({
      email,
      password,
      confirmPassword,
    });

    return response.json({ token });
  }
}

