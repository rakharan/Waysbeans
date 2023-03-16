import React, { useContext } from "react";
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
    formData.set("image", productInput.image[0], productInput.image[0].name);
    formData.set("name", productInput.name);
    formData.set("desc", productInput.desc);
    formData.set("price", productInput.price);
    formData.set("stock", productInput.stock);
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
  return (
    <>
      <div className="flex justify-center flex-col items-center py-10">
        <div className="loginFormCard px-[33px] max-w-[500px]">
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
              <div>
                {preview && (
                  <div className="flex justify-center items-center">
                    <LazyLoadImage
                      effect="blur"
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
                onChange={handleEditInput}
                required
              />
              <Button className="mt-5 bg-[#613D2B] text-white w-full">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
