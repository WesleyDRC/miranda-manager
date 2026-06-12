import { IStoreUserDTO }  from "@/modules/auth/dtos/IStoreUserDTO"
import { IUser } from "@/modules/auth/entities/IUser"

export interface IAuthRepository {
	create(user: IStoreUserDTO): Promise<string>
	findByEmail(email: string): Promise<Array<IUser> | []>
	findById(id: string): Promise<Array<IUser> | []>
}