import ICustomer from "./ICustomer"

interface IAccess {
    id: number,
    date: string | Date,
    customer: ICustomer,
    type: number
}

export default IAccess