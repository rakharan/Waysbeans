import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import Button from "../parts/Button";
import { useMutation } from "react-query";
import { API } from "../config/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const AddProduct = () => {
  document.title = "Waysbeans | Add Product";
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
    const response = await API.post("/product", formData, config);
    if (response.status === 200) {
      navigate("/admin/listProduct");

      setPreview(null);
      Swal.fire({
        title: "New product has been added!",
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
      <div className="flex justify-center my-24 gap-x-20 items-center">
        <div className="leftContent flex flex-col text-center justify-center">
          <h1>Add Product</h1>
          <div className="form md:w-full flex justify-center w-[280px]">
            <form
              action=""
              className="flex flex-col gap-y-5 w-[280px]"
              onSubmit={(e) => {
                handleSubmitProduct.mutate(e);
              }}
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={productInput.productName}
                onChange={handleEditInput}
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={productInput.stock}
                onChange={handleEditInput}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={productInput.price}
                onChange={handleEditInput}
                required
              />
              <textarea
                name="desc"
                id="description"
                cols="30"
                rows="10"
                className=" resize-none outline bg-[#613D2B40] rounded-[5px]"
                placeholder="description"
                value={productInput.description}
                onChange={handleEditInput}
                required
              ></textarea>
              <input
                type="file"
                id="upload"
                name="image"
                onChange={handleEditInput}
                required
              />
              <div
                onClick={(e) => {
                  e.preventDefault;
                }}
              >
                <Button className="bg-[#613D2B] text-white w-[260px] h-10">
                  Add Product
                </Button>
              </div>
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

export default AddProduct;
