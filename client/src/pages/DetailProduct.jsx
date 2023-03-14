import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../config/api";
import { UserContext } from "../context/UserContext";
import { GlobalContext } from "../context/GlobalContext";
import Button from "../parts/Button";
const DetailProduct = () => {
  document.title = "Waysbeans | Product Detail";
  const params = useParams();
  const id = parseInt(params.id);

  let { data: DetailProduct } = useQuery("detailProductCache", async () => {
    const response = await API.get("/product/" + id);
    return response.data.data;
  });

  const [state] = useContext(UserContext);

  // Setup Cart Form
  const [form, setForm] = useState({
    id: parseInt(id),
    orderQuantity: "1",
  });
  // setup form cart on change
  function handleOnChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleOnSubmit(e) {
    try {
      e.preventDefault();
      const data = {
        id: form.id,
        orderQuantity: parseInt(form.orderQuantity),
      };
      // get resp from cart
      const response = await API.post("/cart", data);
      // popup if success
      if (response.status === 200) {
        Swal.fire({
          title: "Product added to your cart!",
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
      }
    } catch (error) {
      Swal.fire({
        title: "You need to login first!",
        icon: "error",
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
    }

    if (state.user.role === "admin") {
      e.preventDefault();
      Swal.fire({
        title: "You are an admin!",
        icon: "error",
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
    }
  }
  const { functionHandlers } = useContext(GlobalContext);
  const { price } = functionHandlers;

  return (
    <div
      className="flex w-full justify-center items-center
    mt-[92px] mb-20"
    >
      <div className="productDetail flex justify-center items-center w-[1035px] gap-x-40">
        <div className="productImage h-[555px]">
          <img src={DetailProduct?.image} alt="" className="max-h-[555px]" />
        </div>
        <div className="productDescription text-[#613D2B] max-w-[544px] flex flex-col gap-y-2">
          <h1 className=" font-black text-[48px] leading-[65.57px] mb-[3px]">
            {DetailProduct?.name.toUpperCase()}
          </h1>
          <span className=" font-normal text-sm leading-[24.59px] mb-[35px]">
            Stock : {DetailProduct?.stock}
          </span>
          <p className="text-justify text-lg mb-[21px]">
            {DetailProduct?.desc}
          </p>
          <div className="productPrice flex">
            <p className="">Price : {price.format(DetailProduct?.price)}</p>
          </div>
          <div className="addCartButton mt-[55px]">
            <form
              action=""
              onSubmit={handleOnSubmit}
              className="flex flex-col gap-y-2"
            >
              <label htmlFor="quantity">Quantity</label>
              <input
                defaultValue={1}
                type="number"
                name="orderQuantity"
                min={1}
                max={DetailProduct?.stock}
                onChange={handleOnChange}
              />
              <Button
                className="w-full hover:text-white hover:bg-[#613D2B]"
                type="submit"
              >
                Add Cart
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
