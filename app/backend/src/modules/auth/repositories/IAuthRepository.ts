import { IStoreUserDTO }  from "../dtos/IStoreUserDTO"
import { IUser } from "../entities/IUser"

export interface IAuthRepository {
	create(user: IStoreUserDTO): Promise<string>
	findByEmail(email: string): Promise<Array<IUser> | []>
	findById(id: string): Promise<Array<IUser> | []>
}