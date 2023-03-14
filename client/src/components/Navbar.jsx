import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../parts/Button";
import { GlobalContext } from "../context/GlobalContext";
import { UserContext } from "../context/UserContext";
import { useQuery } from "react-query";
import { API } from "../config/api";
const Navbar = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);

  const { statesFromGlobalContext } = useContext(GlobalContext);
  const { setIsModalVisible, setIsLoginModal, setIsSignUpModal, setPreview } =
    statesFromGlobalContext;
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const logout = (e) => {
    setPreview(null);
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };
  const { data: carts, refetch } = useQuery("cartCaches", async () => {
    const response = await API.get("/user/cart/");
    return response.data.data;
  });

  let { data: profile } = useQuery("ProfileCache", async () => {
    const response = await API.get("/user/" + state.user.id);
    return response.data.data;
  });

  return (
    <>
      <div className="navbar h-20 bg-[#F5F5F5]  flex justify-between items-center px-[100px] shadow-navbarShadow">
        <div className="navbarLogo">
          <NavLink to="/">
            <img
              className="w-[163px]"
              src="/waysbean.png"
              alt="logo waysbean"
            />
          </NavLink>
        </div>
        <div className="navbarButton flex gap-x-[15px] justify-center items-center">
          {state.isLogin ? (
            <>
              {state.user.role !== "admin" ? (
                <>
                  <NavLink to="/cart" className="cart relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8"
                    >
                      <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                    </svg>
                    <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                      {carts?.length}
                    </div>
                  </NavLink>
                </>
              ) : (
                <></>
              )}
              <div
                className="w-full rounded-[50%] overflow-hidden "
                onMouseEnter={() => {
                  setIsProfileHovered(true);
                }}
                onMouseLeave={() => {
                  setIsProfileHovered(false);
                }}
              >
                <NavLink to="/profile" className="profile relative">
                  <img
                    src={profile?.image}
                    alt="hahah"
                    className=" object-cover h-[50px] w-[50px]"
                  />
                </NavLink>
                {/* user dropdown */}
                {isProfileHovered ? (
                  <>
                    <ul className="absolute top-[60px] bg-white text-black w-60 right-0 rounded-[10px]">
                      <NavLink to="/profile" className="addProduct">
                        <li className="p-4 flex gap-x-4">
                          <div className="w-[24px]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                              />
                            </svg>
                          </div>
                          Profile
                        </li>
                      </NavLink>
                      <NavLink className="logout">
                        <li className="p-4 flex gap-x-4 border-t-[2px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                            />
                          </svg>
                          <button
                            onClick={(event) => {
                              event.preventDefault(), logout();
                            }}
                          >
                            Logout
                          </button>
                        </li>
                      </NavLink>
                    </ul>
                  </>
                ) : (
                  <></>
                )}
                {/* admin dropdown */}
                {state.user.role === "admin" && isProfileHovered ? (
                  <>
                    <ul className="absolute top-[60px] bg-white text-black w-60 right-0 rounded-[10px]">
                      <NavLink to="/admin/addProduct" className="addProduct">
                        <li className="p-4 flex gap-x-4">
                          <div className="w-[24px]">
                            <img src="/coffeeIcon.svg" alt="" />
                          </div>
                          Add Product
                        </li>
                      </NavLink>
                      <NavLink to="/admin/listProduct" className="listProduct">
                        <li className="p-4 flex gap-x-4 border-t-[2px]">
                          <div className="w-[24px]">
                            <img src="/coffeeIcon.svg" alt="" />
                          </div>
                          List Product
                        </li>
                      </NavLink>
                      <NavLink
                        onClick={(event) => {
                          event.preventDefault();
                          logout();
                        }}
                        className="logout"
                      >
                        <li className="p-4 flex gap-x-4 border-t-[2px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                            />
                          </svg>
                          Logout
                        </li>
                      </NavLink>
                    </ul>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => {
                  setIsModalVisible(true);
                  setIsLoginModal(true);
                }}
              >
                <Button className="">Login</Button>
              </NavLink>
              <NavLink
                to="/signUp"
                onClick={() => {
                  setIsModalVisible(true);
                  setIsSignUpModal(true);
                }}
              >
                <Button>Sign Up</Button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
