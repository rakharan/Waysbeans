import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { API } from "../config/api";
import { UserContext } from "../context/UserContext";
import Modal from "../components/Modal/Modal";
import Button from "../parts/Button";
import { GlobalContext } from "../context/GlobalContext";
const Profile = () => {
  document.title = "Waysbeans | Profile";
  const [state] = useContext(UserContext);
  const { statesFromGlobalContext } = useContext(GlobalContext);
  const { preview, setPreview } = statesFromGlobalContext;
  let { data: profile } = useQuery("ProfileCache", async () => {
    const response = await API.get("/user/" + state.user.id);
    return response.data.data;
  });

  const [profileInput, setProfileInput] = useState({
    name: "",
    password: "",
    email: "",
    image: "",
  });
  const handleOnChange = (event) => {
    setProfileInput({
      ...profileInput,
      [event.target.name]:
        event.target.type === "file" ? event.target.files : event.target.value,
    });
    if (event.target.type === "file") {
      let url = URL.createObjectURL(event.target.files[0]);
      setPreview(url);
    }
  };
  const [profileModal, setProfileModal] = useState(false);
  const handleUpdateProfile = useMutation(async (event) => {
    event.preventDefault();
    console.log(profileInput);
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    const formData = new FormData();
    formData.set("name", profileInput.name);
    formData.set("email", profileInput.email);
    formData.set("password", profileInput.password);
    formData.set("image", profileInput.image[0], profileInput.image[0].name);
    const response = await API.patch(
      "/user/" + state.user.id,
      formData,
      config
    );
    console.log(response);
    Swal.fire({
      title: "Profile Updated",
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
    setProfileModal(false);
    setProfileInput({ name: "", email: "", image: "", password: "" });
  });

  const hideModal = () => {
    setProfileModal(false);
  };
  return (
    <>
      <>
        {profileModal && (
          <Modal onClick={hideModal}>
            <div className="flex flex-col">
              <form
                className="flex flex-col p-4 gap-y-4"
                onSubmit={(e) => {
                  handleUpdateProfile.mutate(e);
                }}
              >
                <div>
                  {preview && (
                    <div className="flex justify-center items-center">
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
                <input
                  type="text"
                  placeholder="UserName"
                  name="name"
                  value={profileInput.name}
                  onChange={handleOnChange}
                />
                <input
                  type="password"
                  placeholder="User Password"
                  name="password"
                  value={profileInput.password}
                  onChange={handleOnChange}
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={profileInput.email}
                  onChange={handleOnChange}
                />
                <input
                  type="file"
                  id="upload"
                  name="image"
                  onChange={handleOnChange}
                />
                <Button className="mt-5 bg-[#613D2B] text-white w-full">
                  Submit
                </Button>
              </form>
            </div>
          </Modal>
        )}
      </>

      <div className="flex justify-between px-[200px] my-32">
        <div className="leftCard flex gap-x-4 flex-col">
          <h1 className="font-black text-lg text-[#613D2B] mb-4">My Profile</h1>
          <div className="flex gap-x-4">
            <div className="profileImage min-w-[180px] rounded-lg overflow-hidden">
              <img
                src={profile?.image}
                className="max-w-[180px]"
                alt="profileImage"
              />
            </div>
            <div className="profileDetail flex justify-center flex-col gap-y-4">
              <div>
                <h2>Full Name</h2>
                <p>{profile?.name}</p>
              </div>
              <div>
                <h2>Email</h2>
                <p>{profile?.email}</p>
              </div>
              {state.user.role === "user" ? (
                <>
                  {/* <div>
                    <h2>Address</h2>
                    <p>{user?.address}</p>
                  </div>
                  <div>
                    <h2>Phone</h2>
                    <p>{user?.phone}</p>
                  </div>
                  <div>
                    <h2>Gender</h2>
                    <p>{user?.gender}</p>
                  </div> */}
                  <div>
                    <h1>
                      <span
                        className="hover:bg-blue-500 cursor-pointer"
                        onClick={() => {
                          setProfileModal(true);
                        }}
                      >
                        Edit Profile
                      </span>
                    </h1>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          {state.user.role === "admin" ? (
            <>
              <NavLink to="/admin">
                <h1 className="hover:bg-orange-400 text-center mt-10">
                  back to admin dashboard
                </h1>
              </NavLink>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="rightCard">
          <div>
            <h1 className="font-bold text-lg text-[#613D2B] mb-4">
              My Transaction
            </h1>
            <div className="transctionContainer">
              <div className="flex flex-col gap-y-3">
                No transaction to be shown
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
