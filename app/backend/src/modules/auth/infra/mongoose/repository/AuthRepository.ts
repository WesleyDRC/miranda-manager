import { IStoreUserDTO } from "../../../dtos/IStoreUserDTO";
import { IAuthRepository } from "../../../repositories/IAuthRepository";
import { IUser } from "../../../entities/IUser";
import { User } from "../entities/User";

export class AuthRepository implements IAuthRepository {
	async create({ email, password }: IStoreUserDTO): Promise<string> {

		const newUser = await User.create({ email, password});

		return Promise.resolve(newUser._id);
	}

	async findByEmail(email: string): Promise<IUser[] | []> {
		const founduser = await User.findOne({email});

		return Promise.resolve(founduser ? [founduser] : [])
	}
}
