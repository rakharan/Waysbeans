import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { useQuery } from "react-query";
import { API } from "../config/api";

import Swal from "sweetalert2";

const ListProduct = () => {
  document.title = "Waysbeans | List Products";
  const { statesFromGlobalContext, functionHandlers } =
    useContext(GlobalContext);
  const { preview } = statesFromGlobalContext;
  const { handleEdit } = functionHandlers;

  const { data: productList, refetch } = useQuery("ProductList", async () => {
    const response = await API.get("/products");
    return response.data.data;
  });

  async function handleDelete(id) {
    await API.delete("/product/" + id);
    refetch();
  }

  return (
    <div className="w-full min-h-screen px-20 bg-zinc-100 flex flex-col justify-center items-center">
      <div className="w-full pt-10 font-bold text-4xl mb-5">List Products</div>
      {/* TABLE */}
      <table>
        <thead className=" text-xs text-gray-700  bg-gray-50  ">
          <tr>
            <th scope="col" className="py-3 px-6">
              No
            </th>
            <th scope="col" className="py-3 px-6">
              Image
            </th>
            <th scope="col" className="py-3 px-6">
              Name
            </th>
            <th scope="col" className="py-3 px-6">
              Stock
            </th>
            <th scope="col" className="py-3 px-6">
              Price
            </th>
            <th scope="col" className="py-3 px-6">
              Description
            </th>
            <th scope="col" className="py-3 px-6">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {productList !== null &&
            productList?.map((data, index) => {
              return (
                <tr key={index} className="text-center">
                  <th className="py-4 px-6">{index + 1}</th>
                  <td className="py-4 px-6">
                    <div>
                      <img
                        src={data.image}
                        style={{
                          maxWidth: "150px",
                          maxHeight: "150px",
                          objectFit: "cover",
                        }}
                        alt={preview}
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6">{data.name}</td>
                  <td className="py-4 px-6">{data.stock}</td>
                  <td className="py-4 px-6">{data.price}</td>
                  <td className="py-4 px-6">
                    <p className="line-clamp-3">{data.desc}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-x-4">
                      <button
                        className="bg-green-500 rounded-lg px-6 py-2 text-white"
                        value={parseInt(data.id)}
                        onClick={handleEdit}
                      >
                        <NavLink to={`/admin/edit-product/${data.id}`}>
                          Edit
                        </NavLink>
                      </button>
                      <button
                        className="bg-red-500 text-white rounded-lg px-4 py-2"
                        value={parseInt(data.id)}
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure?",
                            text: "You won't be able to revert this!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, delete it!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              handleDelete(data.id);
                              Swal.fire(
                                "Deleted!",
                                "Your file has been deleted.",
                                "success"
                              );
                            }
                          });
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ListProduct;
