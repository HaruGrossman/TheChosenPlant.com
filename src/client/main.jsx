import React from "react";
import ReactDOM from "react-dom/client";

import "./index.less";

import { Provider } from "react-redux";
import store from "./store";

// import AuthForm from "./features/auth/AuthForm";
import Navbar from "./layout/Navbar.jsx";
import Carousel from "./features/plants/Home.jsx"; //for home page
//import Footer from "./layout/Footer.jsx";
import Search from "./features/plants/Search.jsx";
import Account from "./features/plants/Account.jsx";
import AuthForm from "../client/features/auth/AuthForm.jsx";
import Maps from "./features/plants/Maps.jsx";
import Details from "./features/plants/PlantDetails.jsx";
import PlantType from "./features/plants/PlantType.jsx";
import Root from "./layout/Root.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Carousel /> },
      { path: "/Search", element: <Search /> },
      { path: "/Account", element: <Account /> },
      { path: "/Login", element: <AuthForm /> },
      { path: "/Maps", element: <Maps /> },
      { path: "/Search/:id", element: <Details /> },
      { path: "/Search/plantType/:id", element: <PlantType /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
