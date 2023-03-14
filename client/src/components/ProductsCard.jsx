import React from "react";
import { NavLink } from "react-router-dom";

const ProductsCard = (props) => {
  return (
    <>
      <div>
        <div className="productCard w-[241px] flex flex-col overflow-hidden h-[400px]  bg-[#F7E6DA] rounded-lg justify-between">
          <div className="w-[240px] h-[240px]">
            <NavLink to={`/product-detail/${props.id}`}>
              <img
                src={props.source}
                alt="produk"
                className="w-full h-full object-cover items-start"
              />
            </NavLink>
          </div>
          <div className="description flex flex-col  px-4">
            <h1 className="productTitle  mt-[14px] font-bold">
              {props.productName} Beans
            </h1>
            <span className="price mt-[11px]">{props.productPrice}</span>
            <span className="stock my-[5px]">Stock : {props.productStock}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsCard;
