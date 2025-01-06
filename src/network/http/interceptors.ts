// import { logout } from "@/hooks/useLogout";
import { TOKEN_KEY } from "@/hooks/useAuth";
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const requestInterceptor = {
  onSuccess: (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);

    config.headers.set("Authorization", `Bearer ${token}`);
    config.headers.set("Accept", "application/json");

    return config;
  },
  onFailed: (error: AxiosError) => {
    return error;
  },
};

export const responseInterceptor = {
  onSuccess: (config: AxiosResponse) => {
    return config;
  },
  onFailed: (error: AxiosError) => {
    if (error.status === 401) {
      // logout()
      throw new Error("Ha ocurrido un error");
    }

    return error.response;
  },
};
