import ICustomer from "@/interfaces/models/ICustomer";
import { string, object, number } from "yup";

export interface CustomerForm extends Omit<ICustomer, 'id' | 'isActive'> {
    status: number,
    password: string
}

export const schema = object().shape({
    name: string().required("Nombre es requerido"),
    email: string().required("Email es requerido").email('Debe ser un email valido'),
    status: number().required('Estatus es requerido').typeError('Estatus es requerido'),

});