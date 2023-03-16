import React, { useContext, useEffect } from "react";
import ProductsCard from "../components/ProductsCard";
import { GlobalContext } from "../context/GlobalContext";
import Login from "../components/auth/Login";
import SignUp from "../components/auth/SignUp";
import Modal from "../components/Modal/Modal";
import { useQuery } from "react-query";
import { API } from "../config/api";

const Home = () => {
  document.title = "Waysbeans";
  const { statesFromGlobalContext, functionHandlers, setPreview } =
    useContext(GlobalContext);
  const {
    isModalVisible,
    setIsModalVisible,
    isLoginModal,
    setIsLoginModal,
    isSignUpModal,
    setIsSignUpModal,
    setProductData,
  } = statesFromGlobalContext;
  // Fetching product data from database
  let { data: products } = useQuery("productsCache", async () => {
    const response = await API.get("/products");
    return response.data.data;
  });

  console.log(products);
  useEffect(() => {
    setProductData(products);
  }, [products]);
  const { price } = functionHandlers;
  const hideModalHandler = () => {
    setIsModalVisible(false);
    setIsSignUpModal(false);
    setIsLoginModal(false);
    setPreview(null);
  };
  return (
    <>
      {isModalVisible ? (
        <Modal onClick={hideModalHandler}>
          {isLoginModal ? <Login /> : <></>}
          {isSignUpModal ? <SignUp /> : <></>}
        </Modal>
      ) : (
        <></>
      )}
      <div className="mainContent">
        <div className="jumbotron w-full justify-center items-center flex mt-10">
          <img src="/Jumbotron.png" alt="" />
        </div>
        <div className="productsList flex flex-wrap justify-center items-center gap-4 mt-[42px] mb-[51px]">
          {products !== undefined && products.length > 0 ? (
            products?.map((res, index) => {
              return (
                <ProductsCard
                  id={res.id}
                  key={index}
                  productName={res.name}
                  source={res.image}
                  productPrice={price.format(res.price)}
                  productStock={res.stock}
                />
              );
            })
          ) : (
            <>
              <h1>No Products to be shown</h1>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
