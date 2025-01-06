import PublicStack from "@/routes/public";
import PrivateStack from "@/routes/private";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import theme from "./utils/theme";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={isAuthenticated ? PrivateStack : PublicStack} />
        <Toaster position="top-right" reverseOrder={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
