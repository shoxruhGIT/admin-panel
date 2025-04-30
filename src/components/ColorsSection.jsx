import axios from "axios";
import React, { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import { toast } from "react-toastify";

const ColorsSection = () => {
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const token = localStorage.getItem("accessToken");

  const [colorDetails, setColorDetails] = useState({
    color_en: "",
    color_de: "",
    color_ru: "",
  });

  // ======================================================== Start get category function ========================================================
  const getColors = async () => {
    try {
      setIsLoading(true);
      const category = await axios.get("https://back.ifly.com.uz/api/colors");
      setColors(category.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getColors();
  }, []);
  // ======================================================== end get category function ========================================================

  // start delete category function ========================================================
  const deleteCategory = async (id) => {
    try {
      if (!token) {
        toast.error("Authorization token topilmadi!");
        return;
      }

      await axios.delete(`https://back.ifly.com.uz/api/colors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Mahsulot muvaffaqiyatli o'chirildi!");
      getColors();
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
  // ======================================================== end delete category function ========================================================

  // ======================================================== start add category function ========================================================
  const handleColorDetails = (e) => {
    const { name, value } = e.target;

    setColorDetails((prevData) => ({ ...prevData, [name]: value }));

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (value.trim() !== "") {
        delete updatedErrors[name];
      } else {
        updatedErrors[name] = `${
          name === "name_en"
            ? "English"
            : name === "name_ru"
            ? "Russian"
            : "German"
        } name should not be empty`;
      }

      return updatedErrors;
    });
  };

  // ======================================================== start update category function ========================================================
  const saveCategory = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    try {
      if (
        !colorDetails.color_de ||
        !colorDetails.color_en ||
        !colorDetails.color_ru
      ) {
        const newError = {
          color_en: "Enlish name is required",
          color_de: "German name is required",
          color_ru: "Russian name is required",
        };

        setErrors({ ...newError });
        setIsOpenModal(true);
      } else if (isEditModal) {
        await axios.patch(
          `https://back.ifly.com.uz/api/colors/${editItemId}`,
          colorDetails,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Kategoriya muvaffaqiyatli yangilandi!");
        setIsOpenModal(false);
        resetForm();
        getColors();
      } else {
        await axios.post("https://back.ifly.com.uz/api/colors", colorDetails, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Kategoriya muvaffaqiyatli qo‘shildi!");

        setIsOpenModal(false);
        resetForm();
        getColors();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const openAddModal = () => {
    setIsEditModal(false);
    setColorDetails({
      color_en: "",
      color_de: "",
      color_ru: "",
    });
    setIsOpenModal(true);
  };

  const openEditModal = (item) => {
    setIsEditModal(true);
    setEditItemId(item.id);
    setColorDetails({
      color_en: item.color_en,
      color_de: item.color_de,
      color_ru: item.color_ru,
    });
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setColorDetails({ color_en: "", color_de: "", color_ru: "" });
    setIsEditModal(false);
    setEditItemId(null);
  };

  return (
    <div className="ml-72 flex-1 p-6">
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Colors</h2>
          <button
            onClick={openAddModal}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add Colors
          </button>
        </div>
        {isOpenModal && (
          <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
            <div className="w-full max-w-[800px] min-h-[400px] bg-white p-8 rounded-lg">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold mb-4">
                  {isEditModal ? "Edit category" : "Add category"}
                </h1>
                <button
                  onClick={() => {
                    setIsOpenModal(false);
                    resetForm();
                  }}
                  className="text-white bg-red-500 rounded-[50%] h-[35px] w-[35px] flex items-center justify-center cursor-pointer"
                >
                  X
                </button>
              </div>
              <form className="flex flex-col gap-4">
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="color_en"
                  >
                    Color Name (EN)
                  </label>
                  <input
                    name="color_en"
                    value={colorDetails.color_en}
                    onChange={handleColorDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="color_en"
                    placeholder="Enlish name"
                    required
                  />
                  {errors.color_en && (
                    <p style={{ color: "red" }}>{errors.color_en}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="color_ru"
                  >
                    Color Name (RU)
                  </label>
                  <input
                    name="color_ru"
                    value={colorDetails.color_ru}
                    onChange={handleColorDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="color_ru"
                    placeholder="Russian name"
                    required
                  />
                  {errors.color_ru && (
                    <p style={{ color: "red" }}>{errors.color_ru}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="color_de"
                  >
                    Color Name (DE)
                  </label>
                  <input
                    name="color_de"
                    value={colorDetails.color_de}
                    onChange={handleColorDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="color_de"
                    placeholder="German name"
                    required
                  />
                  {errors.color_de && (
                    <p style={{ color: "red" }}>{errors.color_de}</p>
                  )}
                </div>
                <button
                  onClick={(e) => saveCategory(e)}
                  className="w-full h-[40px] bg-green-500 text-white font-semibold rounded-md cursor-pointer"
                >
                  {isEditModal ? "Edit color" : "Add color"}
                </button>
              </form>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center min-h-28">
          {isLoading ? (
            <div className="flex-col gap-4 w-full flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
              </div>
            </div>
          ) : colors.length > 0 ? (
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
              {colors.map((item, index) => (
                <tbody key={item.id}>
                  <tr className="bg-white text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {item?.color_en}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.color_ru}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.color_de}
                    </td>
                    <td className="border border-gray-300 p-2 w-50">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-4 py-2 mr-2 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
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

export default ColorsSection;
