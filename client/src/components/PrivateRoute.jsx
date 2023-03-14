import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { UserContext } from "../context/UserContext";
export const PrivateRoute = () => {
  const [state] = useContext(UserContext);

  return state.isLogin === true ? <Outlet /> : <Navigate to="/login" />;
};
export const PrivateRouteAdmin = () => {
  const [state] = useContext(UserContext);
  return state.isLogin === true && state.user.role ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};
