import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/menu",
    element: (
      <Layout>
        <Menu />
      </Layout>
    ),
  },
]);

export default router;


/*
const router = createBrowserRouter([
 {
   path: "/",
   element: <App />,
   children: [
     { index: true, element: <Home /> },
     { path: "menu", element: <Menu /> }, // ✅ This is required
   ],
 },
]);
*/
/*
const router = createBrowserRouter([
 {
   path: "/",
   element: <App />,
   children: [
     { index: true, element: <Layout><Home /></Layout> },
     { path: "menu", element: <Layout><Menu /></Layout> }, // ✅ This is required
   ],
 },
]);

export default router;
*/