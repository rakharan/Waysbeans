import React from "react";
import AdminTransaction from "../data/adminTransaction/AdminTransaction";
import { useQuery } from "react-query";
import { API } from "../config/api";
const AdminDashboard = () => {
  document.title = "Waysbeans | Admin Dashboard";

  const { data: TransactionData } = useQuery("transactionsData", async () => {
    const response = await API.get("/transactions");
    return response.data.data;
  });

  return (
    <div className="w-full min-h-screen px-20 bg-zinc-100 flex flex-col justify-center items-center pb-40">
      <div className="w-full pt-10 font-bold text-4xl mb-5 text-center">
        Income Transaction
      </div>
      {/* TABLE */}
      <table>
        <thead className=" text-xs text-gray-700  bg-gray-50  ">
          <tr>
            <th scope="col" className="py-3 px-6">
              No
            </th>
            <th scope="col" className="py-3 px-6">
              Name
            </th>
            <th scope="col" className="py-3 px-6">
              Address
            </th>
            <th scope="col" className="py-3 px-6">
              Post Code
            </th>
            <th scope="col" className="py-3 px-6">
              Products Order
            </th>
            <th scope="col" className="py-3 px-6">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {TransactionData?.map((data, index) => {
            return (
              <tr key={index}>
                <th className="py-4 px-6">{index + 1}</th>
                <td className="py-4 px-6">{data.name}</td>
                <td className="py-4 px-6">{data.address}</td>
                <td className="py-4 px-6">{data.id}</td>
                <td className="py-4 px-6">{data.cart[0].product.name}</td>
                <td
                  className={`py-4 px-6 ${
                    data.status === `success`
                      ? "text-green-500"
                      : data.status === `pending`
                      ? `text-yellow-500`
                      : data.status === `failed`
                      ? `text-red-500`
                      : ``
                  }`}
                >
                  <span
                    className={`${
                      data.status === `success`
                        ? "bg-green-500/70"
                        : data.status === `pending`
                        ? `bg-yellow-500/70`
                        : data.status === `failed`
                        ? `bg-red-500/70`
                        : ``
                    } text-white px-3 py-2 rounded-lg`}
                  >
                    {data.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
