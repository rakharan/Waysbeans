import React, { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Button from "../../parts/Button";
import { UserContext } from "../../context/UserContext";
import { API, setAuthToken } from "../../config/api";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SignUp = () => {
  const [isOnLogin, setIsOnLogin] = useState(false);
  const { functionHandlers, statesFromGlobalContext } =
    useContext(GlobalContext);
  const {
    loginData,
    input,
    setIsLoggedIn,
    setIsAdmin,
    setIsModalVisible,
    setInput,
    setLoginData,
    preview,
    setPreview,
  } = statesFromGlobalContext;
  const { handleInput, handleInputRegister } = functionHandlers;

  const [_, dispatch] = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogin = useMutation(async (event) => {
    event.preventDefault();
    const response = await API.post("/login", loginData);
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: response.data.data,
    });
    setAuthToken(localStorage.token);

    if (response.data.data.role === "admin") {
      setIsLoggedIn(true);
      setIsModalVisible(false);
      setIsAdmin(true);
      Swal.fire({
        title: "Login Success",
        icon: "success",
        timer: 1500,
        width: 600,
        padding: "3em",
        color: "#c23a63",
        background: "#fff",
        backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
          `,
      });
      navigate("/admin");
    } else {
      setIsLoggedIn(true);
      setIsAdmin(false);
      setIsModalVisible(false);

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
      navigate("/");
    }
    setIsModalVisible(false);
    setLoginData({
      name: "",
      email: "",
      password: "",
    });
  });

  const config = {
    headers: {
      "Content-type": "multipart/form-data",
    },
  };

  const handleRegister = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();

      formData.set("image", input.image[0], input.image[0].name);
      formData.set("name", input.name);
      formData.set("email", input.email);
      formData.set("password", input.password);

      await API.post("/register", formData, config);

      Swal.fire({
        title: "Register Success",
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
      navigate("/");
      setIsModalVisible(false);
    } catch (error) {
      alert("register failed : ", error);
      return;
    }

    setInput({
      name: "",
      password: "",
      email: "",
      image: "",
    });
    setPreview(null);
  });
  return (
    <>
      {isOnLogin ? (
        <>
          <div className="flex justify-center flex-col items-center py-10">
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
                    value={loginData.password}
                    onChange={handleInput}
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
                      setIsOnLogin(false);
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
                  onSubmit={(e) => [handleRegister.mutate(e)]}
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
                <p className="mt-5">
                  Already have an account?{" "}
                  <span
                    className="bg-sky-500 cursor-pointer"
                    onClick={() => {
                      setIsOnLogin(true);
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

export default SignUp;
