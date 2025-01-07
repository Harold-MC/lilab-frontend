import HomeLayout from "@/components/layouts/Home";
import { AccessList, Customers, Users } from "@/pages";
import { createBrowserRouter } from "react-router-dom";

const privateRouter = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      { path: "/", element: <AccessList /> },
      { path: "/customers", element: <Customers /> },
      { path: "/users", element: <Users /> },
    ],
  },
]);

export default privateRouter;
