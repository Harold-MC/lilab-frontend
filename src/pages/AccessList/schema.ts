import IAccess from "@/interfaces/models/IAccess";
import { object } from "yup";

export interface AccessFormType extends IAccess {

}

export const schema = object().shape({
    customer: object().required("Cliente es requerido"),
});