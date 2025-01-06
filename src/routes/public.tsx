import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages";
import PublicLayout from "@/components/layouts/Public";

const publicRouter = createBrowserRouter([
  { element: <PublicLayout />, children: [{ path: "/", element: <Login /> }] },
]);

export default publicRouter;
