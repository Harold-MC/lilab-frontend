import { IUser } from "@/interfaces/models";
import IRole from "@/interfaces/models/IRole";
import { string, object, number } from "yup";

export interface UserForm extends Omit<IUser, "id" | "isActive"> {
  status: number;
  password: string;
}

export const baseSchema = {
  name: string().required("Nombre es requerido"),
  email: string()
    .required("Email es requerido")
    .email("Debe ser un email valido"),
  status: number()
    .required("Estatus es requerido")
    .typeError("Estatus es requerido"),
  role: object<IRole>().required("Rol es requerido"),
};

export const schema = object().shape({
  ...baseSchema,
  password: string().required("Contrasena es requerida"),
});

export const updateSchema = object().shape({
    ...baseSchema,
  });
