import { IPaginationParams } from "../viewModels/IPagination"

interface ICustomer {
    id: string
    name: string
    email: string
    phone: string
    type: number
    isActive: boolean
}

export interface ICustomerParams extends IPaginationParams {
   

}

export default ICustomer