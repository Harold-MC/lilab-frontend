import { UseQueryOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type QueryConfig<T> = Omit<
  UseQueryOptions<Partial<AxiosResponse<Partial<T>>>, Error>,
  "queryKey" | "queryFn"
>;