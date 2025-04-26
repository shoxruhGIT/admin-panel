import axios from "axios";
import React, { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import { toast } from "react-toastify";

const CategorySection = () => {
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCategory = async () => {
    try {
      setIsLoading(true);
      const category = await axios.get("https://back.ifly.com.uz/api/category");
      setCategory(category.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const deleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("accessToken"); // yoki tokenni qayerdan olsang o'sha yerdan

      if (!token) {
        toast.error("Authorization token topilmadi!");
        return;
      }

      await axios.delete(`https://back.ifly.com.uz/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Mahsulot muvaffaqiyatli o'chirildi!");
      
    } catch (error) {
      console.error(error);

      if (error.response) {
        if (error.response.status === 403) {
          toast.error(
            "Sizda bu amalni bajarishga ruxsat yo'q (403 Forbidden)."
          );
        } else if (error.response.status === 401) {
          toast.error(
            "Token noto'g'ri yoki muddati tugagan (401 Unauthorized)."
          );
        } else if (error.response.status === 500) {
          toast.error(
            "Serverda xatolik yuz berdi (500 Internal Server Error)."
          );
        } else {
          toast.error(`Xatolik: ${error.response.status}`);
        }
      } else {
        toast.error("Tarmoq xatoligi yoki server javob bermadi.");
      }
    }
  };

  return (
    <div className="ml-72 flex-1 p-6">
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Products</h2>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
            Add Category
          </button>
        </div>
        <div className="flex flex-col items-center justify-center min-h-28">
          {isLoading ? (
            <div className="flex-col gap-4 w-full flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
              </div>
            </div>
          ) : category ? (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 ">№</th>
                  <th className="border border-gray-300 p-2 ">Title ENG</th>
                  <th className="border border-gray-300 p-2 ">Title RU</th>
                  <th className="border border-gray-300 p-2 ">Title DE</th>
                  <th className="border border-gray-300 p-2 ">Actions</th>
                </tr>
              </thead>
              {category.map((item, index) => (
                <tbody key={item.id}>
                  <tr className="bg-white text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {item?.name_en}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.name_ru}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.name_de}
                    </td>
                    <td className="border border-gray-300 p-2 w-50">
                      <button className="px-4 py-2 mr-2 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(item.id)}
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

export default CategorySection;
