import { IPaginationParams } from "../viewModels/IPagination"
import IRole from "./IRole"

interface IUser {
    id: string,
    name: string,
    email: string,
    role: IRole,
    isActive: boolean
}

export interface IUserParams extends IPaginationParams {
   

}

export default IUser