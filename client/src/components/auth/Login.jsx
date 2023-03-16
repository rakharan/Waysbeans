import React, { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { UserContext } from "../../context/UserContext";
import Button from "../../parts/Button";
import { API, setAuthToken } from "../../config/api";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Login = () => {
  const navigate = useNavigate();
  const [isOnSignUp, setIsOnSignUp] = useState(false);
  const { functionHandlers, statesFromGlobalContext } =
    useContext(GlobalContext);
  const {
    loginData,
    setLoginData,
    setIsModalVisible,
    input,
    setCurrentUser,
    setPreview,
    preview,
  } = statesFromGlobalContext;
  const { handleInput, handleInputRegister, handleRegister } = functionHandlers;
  const [state, dispatch] = useContext(UserContext);

  const handleLogin = useMutation(async (event) => {
    event.preventDefault();
    const response = await API.post("/login", loginData);

    setCurrentUser(response.data.data);
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: response.data.data,
    });
    setAuthToken(response.data.data.token);
    Swal.fire({
      title: "Login Success",
      icon: "success",
      timer: 1500,
      width: 600,
      padding: "3em",
      color: "#c23a63",
      background: "#fff)",
      backdrop: `
        rgba(0,0,123,0.4)
        left top
        no-repeat
      `,
    });
    setIsModalVisible(false);
    setLoginData({
      name: "",
      email: "",
      password: "",
    });
    setPreview(null);
    setIsModalVisible(false);
    {
      response.data.data.role === "admin" ? (
        navigate("/admin")
      ) : response.data.data.role === "user" ? (
        navigate("/")
      ) : (
        <></>
      );
    }
  });
  return (
    <>
      {isOnSignUp ? (
        <>
          <div className="flex justify-center flex-col items-center py-10">
            <div className="loginFormCard px-[33px] max-w-[500px]">
              <div className="header mb-10">
                <h1 className="font-black leading-[49px] text-[36px] text-[#613D2B]">
                  Register
                </h1>
              </div>
              <div className="form flex flex-col">
                <div className="flex justify-center">
                  {preview && (
                    <div className="rounded-full overflow-hidden">
                      <img
                        src={preview}
                        style={{
                          maxWidth: "150px",
                          maxHeight: "150px",
                          objectFit: "cover",
                        }}
                        alt={preview}
                      />
                    </div>
                  )}
                </div>
                <form
                  className="flex flex-col gap-y-5 mt-4"
                  onSubmit={(e) => handleRegister.mutate(e)}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    value={input.name}
                    onChange={handleInputRegister}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={input.email}
                    onChange={handleInputRegister}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={input.password}
                    onChange={handleInputRegister}
                    required
                  />
                  <input
                    type="file"
                    id="upload"
                    name="image"
                    onChange={handleInputRegister}
                  />
                  <Button className="mt-5 bg-[#613D2B] text-white w-full">
                    Register
                  </Button>
                </form>
                <div></div>
                <p className="mt-5">
                  Already have an account?{" "}
                  <span
                    className="bg-sky-500 cursor-pointer"
                    onClick={() => {
                      setIsOnSignUp(false);
                    }}
                  >
                    Click Here
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center flex-col items-center py-10 ">
            <div className="loginFormCard px-[33px] max-w-[500px]">
              <div className="header mb-10">
                <h1 className="font-black leading-[49px] text-[36px] text-[#613D2B]">
                  Login
                </h1>
              </div>
              <div className="form flex flex-col">
                <form
                  className="flex flex-col gap-y-5"
                  onSubmit={(e) => handleLogin.mutate(e)}
                >
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleInput}
                    value={loginData.email}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleInput}
                    value={loginData.password}
                  />
                  <Button className="mt-5 bg-[#613D2B] text-white w-full">
                    Login
                  </Button>
                </form>
                <p className="mt-5">
                  Don't have an account?
                  <span
                    className="bg-sky-500 cursor-pointer"
                    onClick={() => {
                      setIsOnSignUp(true);
                    }}
                  >
                    Click Here
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
