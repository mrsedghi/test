import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import About from "./pages/About";
import SingleMovie from "./pages/SingleMovie";
import NotFound from "./NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/movie/:id",
    element: <SingleMovie />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
