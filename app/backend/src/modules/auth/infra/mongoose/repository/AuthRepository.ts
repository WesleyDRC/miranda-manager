import { IStoreUserDTO } from "../../../dtos/IStoreUserDTO";
import { IAuthRepository } from "../../../repositories/IAuthRepository";
import { IUser } from "../../../entities/IUser";
import { User } from "../entities/User";
import { v4 as uuidv4 } from "uuid";

export class AuthRepository implements IAuthRepository {
	async create({ email, password }: IStoreUserDTO): Promise<string> {

		const newUser = await User.create({ email, password});

		return Promise.resolve(newUser.email);
	}
}
