import HomeLayout from "@/components/layouts/Home";
import { Users } from "@/pages";
import { createBrowserRouter } from "react-router-dom";

const privateRouter = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      { path: "/", element: <Users /> },
      { path: "/customers", element: <Users /> },
    ],
  },
]);

export default privateRouter;
