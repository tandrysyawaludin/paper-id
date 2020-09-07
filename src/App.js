import React from "react";
import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Summary from "./pages/Summary";

const routes = [
  {
    path: "/",
    exact: true,
    component: Login,
  },
  {
    path: "/home",
    exact: true,
    component: Home,
  },
  {
    path: "/summary",
    exact: true,
    component: Summary,
  },
  {
    path: "/financial",
    exact: true,
    component: Login,
    routes: [
      {
        path: "/financial/account",
        exact: true,
        component: Login,
      },
      {
        path: "/financial/transaction",
        exact: true,
        component: Login,
      },
    ],
  },
];

const App = (props) => {
  return <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>;
};

export default App;
