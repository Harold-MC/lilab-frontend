import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/interfaces/config/queryConfig";
import { IUser } from "@/interfaces/models";
import IPagination from "@/interfaces/viewModels/IPagination";
import { IUserParams } from "@/interfaces/models/IUser";
import IRole, { IRoleParams } from "@/interfaces/models/IRole";
import http from "./http";

export const useRoles = (params: IRoleParams, config?: QueryConfig<IRole[]>) => {
  return useQuery({
    ...config,
    queryKey: ["fetchRoles", params],
    queryFn: () => http.get<IRole[]>("/api/roles", { params }),
  });
};

export const useUsers = (
  params: IUserParams,
  config?: QueryConfig<IPagination<IUser>>
) => {
  return useQuery({
    ...config,
    queryKey: ["fetchUsers", params],
    queryFn: ()=> http.get<IPagination<IUser>>("/api/users", { params }),
    select: (response) => response.data
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: IUser) => http.post("/api/users", data),
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: (data: IUser) => http.post("/api/users", data),
  });
};
