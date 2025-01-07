import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/interfaces/config/queryConfig";
import IPagination from "@/interfaces/viewModels/IPagination";
import ICustomer, { ICustomerParams } from "@/interfaces/models/ICustomer";
import http from "./http";

export const useCustomers = (
  params: ICustomerParams,
  config?: QueryConfig<IPagination<ICustomer>>
) => {
  return useQuery({
    ...config,
    queryKey: ["fetchCustomers", params],
    queryFn: ()=> http.get<IPagination<ICustomer>>("/api/customers", { params }),
    select: (response) => response.data
  });
};

export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: (data: ICustomer) => http.post("/api/customers", data),
  });
};

export const useUpdateCustomer = () => {
  return useMutation({
    mutationFn: (data: ICustomer) => http.post("/api/customers", data),
  });
};

export const useRemoveCustomer = () => {
  return useMutation({
    mutationFn: (data: string) => http.delete(`/api/customers/${data}`),
  });
};
