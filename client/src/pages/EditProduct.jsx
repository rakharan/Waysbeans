import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import Button from "../parts/Button";
import { useMutation } from "react-query";
import { API } from "../config/api";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Swal from "sweetalert2";
const EditProduct = () => {
  document.title = "Waysbeans | Edit Product";
  const navigate = useNavigate();
  const { statesFromGlobalContext, functionHandlers } =
    useContext(GlobalContext);
  const { productInput, setProductInput, preview, setPreview } =
    statesFromGlobalContext;
  const { handleEditInput } = functionHandlers;

  const handleSubmitProduct = useMutation(async (event) => {
    event.preventDefault();
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    const formData = new FormData();
    formData.set("name", productInput.name);
    formData.set("desc", productInput.desc);
    formData.set("price", productInput.price);
    formData.set("stock", productInput.stock);
    formData.set("image", productInput.image);

    // new instance
    const response = await API.patch(
      "/product/" + productInput.id,
      formData,
      config
    );

    if (response.status === 200) {
      setPreview(null);
      navigate("/admin/listProduct");
      Swal.fire({
        title: "Product has been updated!",
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
      setProductInput({
        name: "",
        price: 0,
        image: "",
        stock: 0,
        desc: "",
      });
    }
  });

  const handleEditInputImage = (event) => {
    let url = URL.createObjectURL(event.target.files[0]);
    setProductInput({
      ...productInput,
      image: event.target.files[0],
    });
    setPreview(url);
  };

  useEffect(() => {
    console.log("all products input", productInput);
    console.log("product input image", productInput.image);
  }, [productInput]);
  return (
    <>
      <div className="flex justify-center items-center py-10 gap-x-5">
        <div className=" px-[33px] max-w-[500px]">
          <div className="header mb-10">
            <h1 className="font-black leading-[49px] text-[36px] text-[#613D2B]">
              Edit Product
            </h1>
          </div>
          <div className="form flex flex-col">
            <form
              className="flex flex-col gap-y-5"
              onSubmit={(e) => {
                handleSubmitProduct.mutate(e);
              }}
            >
              <input
                type="text"
                placeholder="Product Name"
                name="name"
                value={productInput.name}
                onChange={handleEditInput}
              />
              <input
                type="number"
                placeholder="Product Stock"
                name="stock"
                value={productInput.stock}
                onChange={handleEditInput}
              />
              <input
                type="number"
                placeholder="Product Price"
                name="price"
                value={productInput.price}
                onChange={handleEditInput}
              />
              <textarea
                name="desc"
                id="description"
                cols="30"
                rows="10"
                className="resize-none"
                placeholder="Product Description"
                value={productInput.desc}
                onChange={handleEditInput}
              ></textarea>
              <input
                type="file"
                id="upload"
                name="image"
                onChange={handleEditInputImage}
              />
              <Button className="mt-5 bg-[#613D2B] text-white w-full">
                Submit
              </Button>
            </form>
          </div>
        </div>
        <div className="rightContent flex flex-col justify-center ">
          <div>
            <div>
              {preview && (
                <div className="flex justify-center items-center rounded-lg overflow-hidden">
                  <LazyLoadImage
                    effect="blur"
                    src={preview}
                    style={{
                      maxWidth: "300px",
                      maxHeight: "300px",
                      objectFit: "cover",
                    }}
                    alt={preview}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
