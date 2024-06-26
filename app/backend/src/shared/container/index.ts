import { container } from "tsyringe";

import { AuthRepository } from "../../modules/auth/infra/mongoose/repository/AuthRepository";
import { IAuthRepository } from "../../modules/auth/repositories/IAuthRepository";

container.registerSingleton<IAuthRepository>("AuthRepository", AuthRepository)