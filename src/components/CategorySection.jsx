import axios from "axios";
import React, { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import { toast } from "react-toastify";
import Loading from "../ui/Loading";
import DeleteModal from "../ui/DeleteModal";

const CategorySection = () => {
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const token = localStorage.getItem("accessToken");

  const [categoryDetails, setCategoryDetails] = useState({
    name_en: "",
    name_de: "",
    name_ru: "",
  });

  // ======================================================== Start get category function ========================================================
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
  // ======================================================== end get category function ========================================================

  // start delete category function ========================================================
  const deleteCategory = async (id) => {
    try {
      if (!token) {
        toast.error("Authorization token topilmadi!");
        return;
      }

      await axios.delete(`https://back.ifly.com.uz/api/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Category deleted successfully!");
      getCategory();
      setIsOpenDeleteModal(false);
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
  const handleCategoryDetails = (e) => {
    const { name, value } = e.target;

    setCategoryDetails((prevData) => ({ ...prevData, [name]: value }));

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
        !categoryDetails.name_de ||
        !categoryDetails.name_en ||
        !categoryDetails.name_ru === 0
      ) {
        const newError = {
          name_en: "Enlish name is required",
          name_de: "German name is required",
          name_ru: "Russian name is required",
        };

        setErrors({ ...newError });
        setIsOpenModal(true);
      } else if (isEditModal) {
        await axios.patch(
          `https://back.ifly.com.uz/api/category/${editItemId}`,
          categoryDetails,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Category updated successfully!");
        setIsOpenModal(false);
        getCategory();
      } else {
        await axios.post(
          "https://back.ifly.com.uz/api/category",
          categoryDetails,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Category added successfully!");

        setIsOpenModal(false);
        resetForm();
        getCategory();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const openAddModal = () => {
    setIsEditModal(false);
    setCategoryDetails({
      name_en: "",
      name_de: "",
      name_ru: "",
    });
    setIsOpenModal(true);
  };

  const openEditModal = (item) => {
    setIsEditModal(true);
    setEditItemId(item.id);
    setCategoryDetails({
      name_en: item.name_en,
      name_de: item.name_de,
      name_ru: item.name_ru,
    });
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setCategoryDetails({ name_en: "", name_de: "", name_ru: "" });
    setIsEditModal(false);
    setEditItemId(null);
  };

  return (
    <div className="ml-72 flex-1 p-6">
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Categories</h2>
          <button
            onClick={openAddModal}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add Category
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
                    htmlFor="name_en"
                  >
                    Category Name (EN)
                  </label>
                  <input
                    name="name_en"
                    value={categoryDetails.name_en}
                    onChange={handleCategoryDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="name_en"
                    placeholder="Enlish name"
                    required
                  />
                  {errors.name_en && (
                    <p style={{ color: "red" }}>{errors.name_en}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="name_en"
                  >
                    Category Name (RU)
                  </label>
                  <input
                    name="name_ru"
                    value={categoryDetails.name_ru}
                    onChange={handleCategoryDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="name_en"
                    placeholder="Russian name"
                    required
                  />
                  {errors.name_ru && (
                    <p style={{ color: "red" }}>{errors.name_ru}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="name_en"
                  >
                    Category Name (DE)
                  </label>
                  <input
                    name="name_de"
                    value={categoryDetails.name_de}
                    onChange={handleCategoryDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="name_en"
                    placeholder="German name"
                    required
                  />
                  {errors.name_de && (
                    <p style={{ color: "red" }}>{errors.name_de}</p>
                  )}
                </div>
                <button
                  onClick={(e) => saveCategory(e)}
                  className="w-full h-[40px] bg-green-500 text-white font-semibold rounded-md cursor-pointer"
                >
                  {isEditModal ? "Update category" : "Add category"}
                </button>
              </form>
            </div>
          </div>
        )}
        {isOpenDeleteModal && (
          <DeleteModal
            deleteItem={() => deleteCategory(selectedCategory.id)}
            onCancel={() => setIsOpenDeleteModal(false)}
            label="category"
          />
        )}
        <div className="flex flex-col items-center justify-center min-h-28">
          {isLoading ? (
            <Loading />
          ) : category.length > 0 ? (
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
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-4 py-2 mr-2 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setIsOpenDeleteModal(true);
                          setSelectedCategory(item);
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

export default CategorySection;
