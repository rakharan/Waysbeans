import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import SharedLayout from "./components/SharedLayout";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";
import DetailProduct from "./pages/DetailProduct";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
import ListProduct from "./pages/ListProduct";
import { PrivateRoute, PrivateRouteAdmin } from "./components/PrivateRoute";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import EditProduct from "./pages/EditProduct";
import { UserContext } from "./context/UserContext";
import { API, setAuthToken } from "./config/api";
import NotFound from "./components/NotFound";
import ServerError from "./pages/ServerError";
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (state.isLogin === false && !isLoading) {
      navigate("/");
    }
    if (state.user.role === "admin") {
      navigate("/admin");
    }
    if (state.user.role === "user") {
      navigate("/");
    }
    // else {
    //   if (state.user.role === "admin") {
    //     navigate("/admin");
    //   } else if (state.user.role === "user") {
    //     navigate("/");
    //   }
    // }
    setAuthToken(localStorage.token);
  }, []);

  async function checkAuth() {
    try {
      // get auth response
      const response = await API.get("/auth");
      // get response data
      let payload = response.data.data;
      // post token to local storage
      payload.token = localStorage.token;
      // dispatch status
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
      // change state loading
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      // check error if from network
      if (error.code === "ERR_NETWORK") {
        // dispatch status
        return (
          dispatch({ type: "AUTH_ERROR" }),
          setTimeout(() => {
            setIsLoading(false);
          }, 3000),
          alert("server is under maintenance"),
          navigate("/server-error")
        );
      }
      // check error auth response if from client side
      else if (error.response?.status >= 400 && error.response?.status <= 499) {
        // dispatch status
        return (
          dispatch({
            type: "AUTH_ERROR",
          }),
          setTimeout(() => {
            // change state loading
            setIsLoading(false),
              // redirect to homepage
              navigate("/");
          }, 3000)
        );
        // check error auth response if from server side
      } else if (
        error.response?.status >= 500 &&
        error.response?.status <= 599
      ) {
        // dispatch status
        return (
          dispatch({
            type: "AUTH_ERROR",
          }),
          // change state loading
          setIsLoading(false),
          // redirect to homepage
          navigate("/")
        );
      }
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <div className="min-h-screen flex justify-center items-center loadingScreen">
            <div>
              <img src="waysbean.png" alt="" width="300px" />
            </div>
          </div>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<SharedLayout />}>
              <Route index element={<Home />} />
              <Route path="/product-detail/:id" element={<DetailProduct />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
              </Route>
              <Route path="/" element={<PrivateRouteAdmin />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/addProduct" element={<AddProduct />} />
                <Route path="/admin/listProduct" element={<ListProduct />} />
                <Route
                  path="/admin/edit-product/:id"
                  element={<EditProduct />}
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/server-error" element={<ServerError />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default App;
