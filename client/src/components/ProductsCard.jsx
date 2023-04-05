import React from "react";
import { NavLink } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const ProductsCard = (props) => {
  return (
    <>
      <div>
        <div className="productCard w-[120px] h-[165px] md:w-[240px] flex flex-col overflow-hidden md:h-[360px]  bg-[#F7E6DA] rounded-lg justify-between">
          <div className="imageContainer w-[120px] h-[120px] md:w-[240px] md:h-[240px]">
            <NavLink to={`/product-detail/${props.id}`}>
              <LazyLoadImage
                width={`100%`}
                height={`100%`}
                className="w-full h-full object-cover items-start"
                src={props.source}
                alt="produk"
                effect="blur"
              />
            </NavLink>
          </div>
          <div className="description flex flex-col  px-4">
            <h1 className="productTitle lg:mt-[14px] font-bold text-[8px] md:text-base lg:text-lg">
              {props.productName}
            </h1>
            <span className="price lg:mt-[11px] text-[8px] md:text-base lg:text-lg">
              {props.productPrice}
            </span>
            <span className="stock lg:my-[5px] md:text-base lg:text-lg text-[8px]">
              Stock : {props.productStock}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsCard;
