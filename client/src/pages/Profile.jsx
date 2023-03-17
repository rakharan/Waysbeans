import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { API } from "../config/api";
import { UserContext } from "../context/UserContext";
import Modal from "../components/Modal/Modal";
import Button from "../parts/Button";
import { GlobalContext } from "../context/GlobalContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const Profile = () => {
  document.title = "Waysbeans | Profile";
  const [state] = useContext(UserContext);
  const navigate = useNavigate();
  const { statesFromGlobalContext, functionHandlers } =
    useContext(GlobalContext);
  const { preview, setPreview } = statesFromGlobalContext;
  const { price } = functionHandlers;
  let { data: profile } = useQuery(
    "ProfileCache",
    async () => {
      const response = await API.get("/user/" + state.user.id);
      return response.data.data;
    },
    { refetchInterval: 200 }
  );
  const [transactionDetail, setTransactionDetail] = useState([]);
  const { data: userTransaction, refetch } = useQuery(
    "userTransactionCache",
    async () => {
      const response = await API.get("/user/transaction");
      return response.data.data;
    }
  );

  useEffect(() => {
    refetch();
  }, [userTransaction]);

  const [showDetailTx, setShowDetailTx] = useState(false);
  const handleClose = () => {
    setShowDetailTx(false);
  };
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

  const filterTx = (txID) => {
    const filtered = userTransaction.filter((e) => e.id === txID);
    setTransactionDetail(filtered);
  };
  const hideModal = () => {
    setProfileModal(false);
  };
  return (
    <>
      <>
        {showDetailTx && (
          <>
            <Modal
              onClick={() => {
                handleClose();
              }}
            >
              <div
                className={`fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-lg transition-all duration-300 ${
                  showDetailTx ? `opacity-100` : `opacity-0`
                }`}
              >
                <div className="w-full p-4">
                  <div className="border-b-2 flex justify-between">
                    <h1 className=" font-bold">Transaction Detail</h1>
                    <span
                      className="font-bold text-xl cursor-pointer"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      X
                    </span>
                  </div>
                  <div className="flex flex-col justify-between w-full">
                    <h1 className="my-5 text-md">
                      List of Products inside transaction id:{" "}
                      <span className="font-bold">
                        #{transactionDetail[0].id}
                      </span>
                    </h1>
                    <div className="leftContent">
                      <div className="flex flex-col gap-y-4 ">
                        {transactionDetail?.map((data) => {
                          return data?.cart.map((cart, index) => {
                            return (
                              <div
                                key={index}
                                className="flex justify-center items-center md:gap-x-5 border p-2 rounded-lg w-full md:justify-between flex-col md:flex-row"
                              >
                                <div className="leftContent flex  items-center gap-x-4">
                                  <div className="imageContainer w-[100px] h-[100px] flex overflow-hidden rounded-lg">
                                    <LazyLoadImage
                                      effect="blur"
                                      src={cart.product.image}
                                      alt="product image"
                                      className=" object-cover"
                                    />
                                  </div>
                                  <div className="detailContainer">
                                    <h1>{cart.product.name}</h1>
                                    <p className="opacity-40">
                                      {cart.orderQuantity} x{" "}
                                      {price.format(cart.product.price)}
                                    </p>
                                  </div>
                                </div>
                                <div className="rightContent flex flex-col gap-y-2 md:border-l-2 md:pl-36 justify-center items-center w-full mt-5 md:mt-0">
                                  <div className="flex flex-col">
                                    <h3 className="text-sm">Total Harga</h3>
                                    <span className="font-bold text-sm">
                                      {price.format(
                                        cart.product.price * cart.orderQuantity
                                      )}
                                    </span>
                                  </div>
                                  <Button
                                    className="text-[#03AC0E] font-semibold border-[#03AC0E] hover:bg-[#03AC0E] hover:text-white"
                                    onClick={() => {
                                      navigate(
                                        "/product-detail/" + cart.product.id
                                      );
                                    }}
                                  >
                                    Buy Again
                                  </Button>
                                </div>
                              </div>
                            );
                          });
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </>
        )}
      </>
      <>
        {profileModal && (
          <Modal onClick={hideModal}>
            <div className="flex flex-col w-[280px]">
              <form
                className="flex flex-col p-4 gap-y-4"
                onSubmit={(e) => {
                  handleUpdateProfile.mutate(e);
                }}
              >
                <div>
                  {preview && (
                    <div className="flex justify-center items-center">
                      <LazyLoadImage
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

      <div className="flex justify-center my-32 flex-col px-2 md:flex-row md:gap-x-10">
        <div className="leftCard flex gap-x-4 flex-col">
          <h1 className="font-black text-lg text-[#613D2B] mb-4 text-center md:text-left">
            My Profile
          </h1>
          <div className="flex gap-x-4 flex-col justify-center w-full items-center mb-6 md:flex-row">
            <div className="profileImage min-w-[180px] rounded-lg overflow-hidden">
              <LazyLoadImage
                effect="blur"
                src={profile?.image}
                className="max-w-[180px] rounded-lg"
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
        {state.user.role === "user" ? (
          <>
            {" "}
            <div className="rightCard">
              <div>
                <h1 className="font-bold text-lg text-[#613D2B] mb-4">
                  My Transaction
                </h1>
                <div className="transctionContainer">
                  <div className="flex flex-col gap-y-3">
                    {userTransaction?.map((data, index) => {
                      const totalOrderQuantity = data.cart.reduce(
                        (acc, item) => acc + item.orderQuantity,
                        0
                      );
                      const dateStr = data.update_at;
                      const dateObj = new Date(dateStr);
                      const formattedDate = dateObj.toDateString("en-US");
                      return (
                        <>
                          <div className="gap-y-4 flex flex-col" key={index}>
                            <div className="p-4 bg-[#F6E6DA] flex justify-between items-center w-full md:w-[350px] lg:w-[530px] text-[#613D2B] rounded-xl">
                              <div className="leftCard flex gap-x-4">
                                <div className="w-20">
                                  <LazyLoadImage
                                    effect="blur"
                                    src={data.cart[0].product.image}
                                    alt="product thumbnail"
                                    className="rounded-lg"
                                  />
                                </div>
                                <div className="productDetail text-xs flex flex-col gap-y-1 justify-between">
                                  <p>
                                    <span className="font-bold">
                                      {formattedDate}
                                    </span>
                                  </p>
                                  <p>Qty: {totalOrderQuantity}</p>
                                  <p>Sub Total: {price.format(data.total)}</p>
                                  <h1
                                    className="text-[#03AC0E] font-bold cursor-pointer"
                                    onClick={() => {
                                      setShowDetailTx(true), filterTx(data.id);
                                    }}
                                  >
                                    Transaction Detail
                                  </h1>
                                </div>
                              </div>
                              <div className="rightCard">
                                <div className="flex flex-col gap-y-2 items-center bg-gradient-to-b">
                                  <LazyLoadImage
                                    effect="blur"
                                    width="73px"
                                    src="/waysbean.png"
                                    alt="waysbeans logo"
                                  />
                                  <LazyLoadImage
                                    effect="blur"
                                    width="50px"
                                    src="/qrCode.png"
                                    alt=""
                                  />
                                  <div
                                    className={`w-[112px] text-center rounded-[2px] text-white ${
                                      data.status == `success`
                                        ? `bg-[#00ff1a]/60`
                                        : data.status == `failed`
                                        ? `bg-[#FF9900]/60`
                                        : data.status == `pending`
                                        ? `bg-[#FF9900]/60`
                                        : `bg-blue-500`
                                    }`}
                                  >
                                    <p className="text-xs py-1 ">
                                      {data.status.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Profile;
