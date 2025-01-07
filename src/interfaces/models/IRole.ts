import { IPaginationParams } from "../viewModels/IPagination"
import IPermission from "./IPermission"

interface IRole {
    id: number,
    name: string,
    permissions?: IPermission[]
}

export interface IRoleParams extends IPaginationParams {
   

}

export default IRole