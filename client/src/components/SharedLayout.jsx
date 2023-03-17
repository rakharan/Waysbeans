import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const SharedLayout = (props) => {
  return (
    <>
      <Navbar
        mobileNavbar={props.mobileNavbar}
        setMobileNavbar={props.setMobileNavbar}
      />
      <Outlet />
    </>
  );
};

export default SharedLayout;
