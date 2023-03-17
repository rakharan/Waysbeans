import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../parts/Button";
import { GlobalContext } from "../context/GlobalContext";
import { UserContext } from "../context/UserContext";
import { useQuery } from "react-query";
import { API } from "../config/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./mobileNavbar.module.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import burgerMenu from "/burgerMenu.svg";

const MobileNavbar = (props) => {
  const navigate = useNavigate();
  const { statesFromGlobalContext } = useContext(GlobalContext);
  const { setPreview } = statesFromGlobalContext;
  const [state, dispatch] = useContext(UserContext);
  let { data: profile } = useQuery(
    "ProfileCache",
    async () => {
      if (state.isLogin) {
        const response = await API.get("/user/" + state.user.id);
        return response.data.data;
      }
    },
    {
      refetchInterval: 200,
    }
  );

  const { data: carts } = useQuery(
    "cartCaches",
    async () => {
      if (state.isLogin) {
        const response = await API.get("/user/cart/");
        return response.data.data;
      }
    },
    {
      refetchInterval: 200,
    }
  );
  const logout = (e) => {
    setPreview(null);
    props.setMobileNavbar(false);
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };
  return (
    <div
      className={` ${styles.mobile__menu}  ${
        props.mobileNavbar ? " opacity-100 visible scale-100" : ""
      }
 mobileNavbar bg-white rounded text-center min-w-[150px] min-h-[40px] z-50 top-[60px] overflow-hidden right-0 text-black divide-y-2 mr-4`}
    >
      {state.user.role === "user" ? (
        <>
          <div>
            <NavLink to="/profile" className="profile relative">
              <div className="flex items-center p-2 gap-x-4">
                <LazyLoadImage
                  width={25}
                  height={25}
                  effect="blur"
                  src={profile?.image}
                  alt="profilePic"
                  className=" object-cover h-[25px] w-[25px] rounded-full"
                />
                <span className="text-xs">
                  <span>{profile?.name}</span>
                </span>
              </div>
            </NavLink>
          </div>
          <div>
            <div className="flex items-center p-2 gap-x-4">
              <NavLink to="/cart" className="cart  flex items-center gap-x-4">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-[25px] h-[25px] "
                  >
                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                  </svg>
                  <span className="absolute inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-[2px] -right-[2px] dark:border-gray-900">
                    {carts?.length}
                  </span>
                </div>
                <span className="text-xs">Cart</span>
              </NavLink>
            </div>
          </div>
          <div>
            <NavLink
              onClick={(event) => {
                event.preventDefault();
                logout();
              }}
              className="logout"
            >
              <div className="flex items-center p-2 gap-x-4">
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
                <span className="text-xs">Logout</span>
              </div>
            </NavLink>
          </div>
        </>
      ) : state.user.role === "admin" ? (
        <>
          {" "}
          <div>
            <NavLink to="/profile" className="profile relative">
              <div className="flex items-center p-2 gap-x-4">
                <LazyLoadImage
                  effect="blur"
                  src={profile?.image}
                  alt="profilePic"
                  className=" object-cover h-[25px] w-[25px] rounded-full overflow-hidden"
                />
                <span className="text-xs">
                  <span>{state.user.name}</span>
                </span>
              </div>
            </NavLink>
          </div>
          <div>
            <NavLink to="/admin/addProduct" className="addProduct">
              <div className="flex items-center p-2 gap-x-4">
                <LazyLoadImage
                  effect="blur"
                  src="/coffeeIcon.svg"
                  alt="coffeeIcon"
                  className=" object-cover h-[25px] w-[25px] overflow-hidden"
                />
                <span className="text-xs">Add Product</span>
              </div>
            </NavLink>
          </div>
          <div>
            <NavLink to="/admin/listProduct" className="listProduct">
              <div className="flex items-center p-2 gap-x-4">
                <LazyLoadImage
                  effect="blur"
                  src="/coffeeIcon.svg"
                  alt="coffeeIcon"
                  className=" object-cover h-[25px] w-[25px] overflow-hidden"
                />
                <span className="text-xs">List Product</span>
              </div>
            </NavLink>
          </div>
          <div>
            <NavLink
              onClick={(event) => {
                event.preventDefault();
                logout();
              }}
              className="logout"
            >
              <div className="flex items-center p-2 gap-x-4">
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
                <span className="text-xs">Logout</span>
              </div>
            </NavLink>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center py-1">
            <NavLink
              onClick={(event) => {
                event.preventDefault();
                props.setMobileNavbar(false);
                navigate("/login");
              }}
            >
              <Button className="flex justify-center items-center border-none font-semibold">
                <span className="text-xs text-center flex">Login</span>
              </Button>
            </NavLink>
          </div>
          <div className="flex items-center justify-center py-1">
            <NavLink
              onClick={(event) => {
                event.preventDefault();
                props.setMobileNavbar(false);
                navigate("/signup");
              }}
            >
              <Button className=" flex justify-center items-center border-none font-semibold">
                <span className="text-xs text-center flex">Sign Up</span>
              </Button>
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
};

const Navbar = (props) => {
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
  const { data: carts } = useQuery(
    "cartCaches",
    async () => {
      if (state.isLogin) {
        const response = await API.get("/user/cart/");
        return response.data.data;
      }
    },
    {
      refetchInterval: 200,
    }
  );

  let { data: profile } = useQuery(
    "ProfileCache",
    async () => {
      if (state.isLogin) {
        const response = await API.get("/user/" + state.user.id);
        return response.data.data;
      }
    },
    {
      refetchInterval: 200,
    }
  );

  return (
    <>
      <div className="navbar h-20 bg-[#F5F5F5]  flex justify-between items-center shadow-navbarShadow px-4 md:px-8 lg:px-20">
        <div className=" flex justify-between w-full items-center">
          <div className="navbarLogo">
            <NavLink to="/">
              <LazyLoadImage
                className="w-[100px] md:w-[150px]"
                height={`100%`}
                src="/waysbean.png"
                alt="logo waysbean"
                effect="blur"
              />
            </NavLink>
          </div>
          <div className="desktopNavbarButton hidden lg:flex lg:gap-x-[15px] lg:justify-center lg:items-center">
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
                  className="w-full "
                  onMouseEnter={() => {
                    setIsProfileHovered(true);
                  }}
                  onMouseLeave={() => {
                    setIsProfileHovered(false);
                  }}
                >
                  <NavLink to="/profile" className="profile relative">
                    <LazyLoadImage
                      effect="blur"
                      width={50}
                      height={50}
                      src={profile?.image}
                      alt="profilePic"
                      className=" object-cover h-[50px] w-[50px] rounded-full"
                    />
                  </NavLink>
                  {/* user dropdown */}
                  {isProfileHovered && state.user.role === "user" ? (
                    <>
                      <ul className="absolute top-[60px] bg-white text-black w-60 right-0 rounded-[10px] z-10">
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
                      <ul className="absolute top-[60px] bg-white text-black w-60 right-0 rounded-[10px] z-50">
                        <NavLink to="/admin/addProduct" className="addProduct">
                          <li className="p-4 flex gap-x-4">
                            <div className="w-[24px]">
                              <LazyLoadImage src="/coffeeIcon.svg" alt="" />
                            </div>
                            Add Product
                          </li>
                        </NavLink>
                        <NavLink
                          to="/admin/listProduct"
                          className="listProduct"
                        >
                          <li className="p-4 flex gap-x-4 border-t-[2px]">
                            <div className="w-[24px]">
                              <LazyLoadImage src="/coffeeIcon.svg" alt="" />
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
                  onClick={() => {
                    setIsModalVisible(true);
                    setIsLoginModal(true);
                  }}
                >
                  <Button className="">Login</Button>
                </NavLink>
                <NavLink
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
        <div className="mobileMenu lg:hidden">
          <button
            className={`items-center min-w-max py-2 px-4 ${
              props.mobileNavbar ? "bg-primary rounded text-white" : "bg-white"
            } `}
          >
            <div className="flex min-w-[20px] min-h-[20px] text-center ">
              <img
                src={burgerMenu}
                alt="icon"
                onClick={() => {
                  props.setMobileNavbar(!props.mobileNavbar);
                }}
              />
            </div>
          </button>
        </div>
      </div>
      <>
        {props.mobileNavbar ? (
          ReactDOM.createPortal(
            <MobileNavbar
              mobileNavbar={props.mobileNavbar}
              setMobileNavbar={props.setMobileNavbar}
            />,
            document.getElementById("portal-root")
          )
        ) : (
          <div></div>
        )}
      </>
    </>
  );
};

export default Navbar;
