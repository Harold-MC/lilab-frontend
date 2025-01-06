import http from "./http";
import { IUser } from "@/interfaces/models";
import { ILogin } from "@/interfaces/viewModels/ILogin";
import { useMutation } from "@tanstack/react-query";

export const useSignIn = () => {
  return useMutation({
    mutationFn: (data: ILogin) =>
      http.post<{ token: string; user: IUser } | { error: string }>(
        "/api/auth",
        data
      ),
  });
};
