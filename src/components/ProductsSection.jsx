import React, { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import axios from "axios";

const ProductsSection = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeletOpen, setIsDeleteOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://back.ifly.com.uz/api/product");
      setData(response.data.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://back.ifly.com.uz/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ml-72 flex-1 p-6">
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Products</h2>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
            Add Product
          </button>
        </div>
        <div className="flex flex-col items-center justify-center min-h-28">
          {isLoading ? (
            <div className="flex-col gap-4 w-full flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
              </div>
            </div>
          ) : data ? (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 ">№</th>
                  <th className="border border-gray-300 p-2 ">Images</th>
                  <th className="border border-gray-300 p-2 ">Title</th>
                  <th className="border border-gray-300 p-2 ">Description</th>
                  <th className="border border-gray-300 p-2 ">Price</th>
                  <th className="border border-gray-300 p-2 ">Category</th>
                  <th className="border border-gray-300 p-2 ">Colors</th>
                  <th className="border border-gray-300 p-2 ">Sizes</th>
                  <th className="border border-gray-300 p-2 ">Discount</th>
                  <th className="border border-gray-300 p-2 ">Materials</th>
                  <th className="border border-gray-300 p-2 ">Actions</th>
                </tr>
              </thead>
              {data.map((item, index) => (
                <tbody key={item.id}>
                  {isOpen && (
                    <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
                      <div className="relative">
                        <img
                          src={selectedImage}
                          alt="full-image"
                          className="max-w-[90vw] max-h-[90vh] rounded"
                        />
                        <button
                          onClick={() => setIsOpen(false)}
                          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  )}
                  {isDeletOpen && (
                    <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
                      <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold mb-4">
                            Are you sure you want to delete this product?
                          </h3>
                          <button
                            onClick={() => setIsDeleteOpen(false)}
                            className="text-white bg-black rounded-[50%] h-[35px] w-[35px] flex items-center justify-center cursor-pointer"
                          >
                            X
                          </button>
                        </div>
                        <div className="flex justify-between">
                          <button
                            onClick={() => {
                              // deleteItem(item.id);
                              console.log(item.id);

                              setIsDeleteOpen(false);
                            }}
                            className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            Yes, delete
                          </button>
                          <button
                            onClick={() => setIsDeleteOpen(false)}
                            className="px-4 cursor-pointer py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <tr className="bg-white text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2 cursor-pointer w-[150px] h-[100px]">
                      <img
                        src={`https://back.ifly.com.uz/${item.images[0]}`}
                        alt="Product"
                        className="w-full h-full rounded-sm"
                        onClick={() => {
                          setIsOpen(true);
                          setSelectedImage(
                            `https://back.ifly.com.uz/${item.images[0]}`
                          );
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.title_en}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.description_en}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.price}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.category?.name_en}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.colors[0]?.color_en}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.sizes && item.sizes.map((s) => s.size).join(", ")}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.discount?.discount}%
                    </td>
                    <td className="border border-gray-300 p-2">
                      {Object.entries(item?.materials || {}).map(
                        ([key, value]) => (
                          <div key={key}>
                            {key}: {value}%
                          </div>
                        )
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button className="px-4 py-2 mr-2 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          // setIsDeleteOpen(true);
                          deleteItem(item.id);
                        }}
                        className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          ) : (
            <>
              <img src={NoData} alt="No Data" className="w-24 h-24 mb-4" />
              <p className="text-gray-500">No Data Available</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
