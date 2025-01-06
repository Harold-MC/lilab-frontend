import { IPaginationParams } from "../viewModels/IPagination"

interface IRole {
    id: number,
    name: string
}

export interface IRoleParams extends IPaginationParams {
   

}

export default IRole