import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/interfaces/config/queryConfig";
import IPagination from "@/interfaces/viewModels/IPagination";
import { ICustomerParams } from "@/interfaces/models/ICustomer";
import IAccess from "@/interfaces/models/IAccess";
import http from "./http";

export const useAccessList = (
  params: ICustomerParams,
  config?: QueryConfig<IPagination<IAccess>>
) => {
  return useQuery({
    ...config,
    queryKey: ["fetchAccessList", params],
    queryFn: () => http.get<IPagination<IAccess>>("/api/access", { params }),
    select: (response) => response.data,
  });
};

export const useCreateAccess = () => {
  return useMutation({
    mutationFn: (data: IAccess) => http.post("/api/access", data),
  });
};
