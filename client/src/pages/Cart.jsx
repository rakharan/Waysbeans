import React, { useContext, useState, useEffect } from "react";
import Button from "../parts/Button";
import { GlobalContext } from "../context/GlobalContext";
import { NavLink } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { API } from "../config/api";
import { UserContext } from "../context/UserContext";
import Modal from "../components/Modal/Modal";
const Cart = () => {
  document.title = "Waysbeans | Cart";
  const { functionHandlers } = useContext(GlobalContext);
  const { price, decrementQuantityHandler } = functionHandlers;

  const [popUpForm, setPopUpForm] = useState(false);

  const [state] = useContext(UserContext);
  // get cart data
  const { data: carts, refetch } = useQuery("cartCache", async () => {
    const response = await API.get("/user/cart/");
    return response.data.data;
  });
  // get current user
  const { data: profile } = useQuery("profileCache", async () => {
    const response = await API.get("/user/" + state.user.id);
    return response.data.data;
  });

  let total = 0;
  let quantity = 0;
  if (!!carts !== false) {
    carts?.forEach((e) => {
      total += e.subtotal;
      quantity += e.orderQuantity;
    });
  }

  // setup delete cart
  async function handleDelete(id) {
    await API.delete("/cart/" + id);
    refetch();
  }

  // setup form transaction
  const [form, setForm] = useState({
    name: profile?.name,
    email: profile?.email,
    phone: profile?.phone,
    address: profile?.address,
    total: total,
  });

  // setup form transaction on change
  function handleOnChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      // get response from transcation
      const response = await API.patch("/transaction", form);
      // get token from response
      const token = response.data.data.token;
      // midtrans snap
      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          // set popup when response success
          setShow(true);
          setTitle(result);
          setAlert("#469F74");
          setTimeout(() => {
            setShow(false);
            navigate("/profile");
          }, 2000);
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          // set popup when response pending
          setShow(true);
          setTitle(result);
          setAlert("#469F74");
          setTimeout(() => {
            setShow(false);
            navigate("/profile");
          }, 2000);
        },
        onError: function (result) {
          /* You may add your own implementation here */
          // set popup when response error
          setShow(true);
          setTitle(result);
          setAlert("#DC3545");
          setTimeout(() => {
            setShow(false);
          }, 2000);
        },
        onClose: function () {
          /* You may add your own implementation here */
          // set popup when close midtrans payment
          setShow(true);
          setTitle("you closed the popup without finishing the payment");
          setAlert("#DC3545");
          setTimeout(() => {
            setShow(false);
          }, 2000);
        },
      });
    } catch (error) {
      // set popup when response failed
      setShow(true);
      setTitle("Payment Failed, Try Again Later");
      setAlert("#DC3545");
      setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  });

  // midtrans default
  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);
  return (
    <>
      <>
        {popUpForm ? (
          <Modal
            onClick={() => {
              setPopUpForm(false);
            }}
          >
            <div className="flex justify-center m-auto p-4">
              <form
                onSubmit={(e) => {
                  handleOnSubmit.mutate(e);
                }}
                className="flex flex-col gap-y-2"
              >
                <h1 className="font-black">Payment Confirmation</h1>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={form.name}
                  disabled
                />
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={form.email}
                  disabled
                />
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  placeholder="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleOnChange}
                  required
                />
                <label htmlFor="address">Address</label>
                <textarea
                  name="address"
                  cols="30"
                  rows="10"
                  className="resize-none"
                  onChange={handleOnChange}
                  required
                ></textarea>
                <Button type="submit">Pay</Button>
              </form>
            </div>
          </Modal>
        ) : (
          <></>
        )}
      </>
      <>
        <div className="w-full flex justify-center items-center min-h-screen">
          <div className="mainCartContent flex justify-around items-center gap-x-20">
            <div className="leftCart w-[660px]">
              <h1 className="font-bold text-2xl">My Cart</h1>
              <div className="leftCartContent">
                <p>Review Your Order</p>
                {/* map over cart product */}

                {carts !== null && carts !== undefined && carts.length > 0 ? (
                  carts?.map((data, index) => {
                    return (
                      <div
                        key={index}
                        className="border-y-4 flex items-center justify-between"
                      >
                        <div className="flex items-center py-4">
                          <img
                            src={data.product.image}
                            alt="kopi"
                            width="80px"
                          />
                          <div className="productOperator ml-[13px] flex flex-col gap-y-4">
                            <h1>{data?.product.name}</h1>
                            <p className="flex gap-x-4 items-center">
                              <span
                                className="cursor-pointer"
                                onClick={() => {
                                  decrementQuantityHandler(data, index);
                                }}
                              >
                                -
                              </span>
                              <span className="bg-sky-300 p-2">
                                {data.orderQuantity}
                              </span>
                              <span
                                className="cursor-pointer"
                                // onClick={incrementQuantityHandler}
                              >
                                +
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="">
                          <div className="flex flex-col justify-center items-center gap-y-4">
                            <p>Rp. {price.format(data.subtotal)}</p>
                            <button
                              value={data.id}
                              onClick={() => {
                                handleDelete(data.id);
                              }}
                            >
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
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <NavLink to="/">
                      <p className="mt-20 ">
                        <span className="hover:bg-sky-400">
                          Your cart is empty, please check our product
                        </span>
                      </p>
                    </NavLink>
                  </>
                )}
              </div>
            </div>
            <div className="rightCart w-[350px] flex flex-col justify-end mt-20">
              <div className="border-y-4  py-4 gap-y-4">
                <h3 className="flex justify-between ">
                  Subtotal <span>{price.format(total)}</span>
                </h3>
                <h3 className="flex justify-between">
                  Qty <span>{quantity}</span>
                </h3>
              </div>
              <h1 className="flex justify-between">
                Total <span>{price.format(total)}</span>
              </h1>
              <div className=" flex justify-end">
                <Button
                  className="bg-[#613D28] w-[260px] h-10 text-white"
                  onClick={() => {
                    setPopUpForm(true);
                  }}
                >
                  Pay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Cart;
