import axios from "axios";
import React, { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import { toast } from "react-toastify";
import DeleteModal from "../ui/DeleteModal";
import axiosInstance from "../services/axiosIntance";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const token = localStorage.getItem("accessToken");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  const [newsDetails, setNewsDetails] = useState({
    title_en: "",
    title_ru: "",
    title_de: "",
    description_en: "",
    description_ru: "",
    description_de: "",
  });

  // ======================================================== Start get news function ========================================================
  const getNews = async () => {
    try {
      setIsLoading(true);
      const news = await axios.get("https://testaoron.limsa.uz/api/news");
      setNews(news.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getNews();
  }, []);
  // ======================================================== end get news function ========================================================

  // ======================================================== start delete news function ========================================================
  const deleteNews = async (id) => {
    try {
      if (!token) {
        toast.error("Authorization token did not find!");
        return;
      }

      await axiosInstance.delete(`/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("News deleted successfully!");
      getNews();
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
  // ======================================================== end delete news function ========================================================

  // ======================================================== start add news function ========================================================
  const handleNewsDetails = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" && files && files[0]) {
      setNewsDetails((prevData) => ({ ...prevData, file: files[0] }));
      return;
    }

    setNewsDetails((prevData) => ({ ...prevData, [name]: value }));

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (value.trim() !== "") {
        delete updatedErrors[name];
      } else {
        updatedErrors[name] = `${
          name === "title_en"
            ? "English"
            : name === "title_ru"
            ? "Russian"
            : name === "title_de"
            ? "German"
            : name === "description_en"
            ? "English"
            : name === "description_ru"
            ? "Russian"
            : "German"
        } name should not be empty`;
      }

      return updatedErrors;
    });
  };

  // ======================================================== start update news function ========================================================
  const saveNews = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    const formData = new FormData();

    formData.append("file", selectedImage);
    formData.append("title_en", newsDetails.title_en);
    formData.append("title_ru", newsDetails.title_ru);
    formData.append("title_de", newsDetails.title_de);
    formData.append("description_en", newsDetails.description_en);
    formData.append("description_ru", newsDetails.description_ru);
    formData.append("description_de", newsDetails.description_de);

    console.log(formData);

    try {
      if (
        !newsDetails.title_en ||
        !newsDetails.title_de ||
        !newsDetails.title_ru ||
        !newsDetails.description_de ||
        !newsDetails.description_en ||
        !newsDetails.description_ru
      ) {
        const newError = {
          title_en: "Enlish name should not be empty",
          title_de: "German name should not be empty",
          title_ru: "Russian name should not be empty",
          description_en: "Enlish name should not be empty",
          description_ru: "Russian name should not be empty",
          description_de: "German name should not be empty",
        };

        setErrors({ ...newError });
        setIsOpenModal(true);
      } else if (isEditModal) {
        await axiosInstance.patch(`/news/${editItemId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("News updated successfully!");
        setIsOpenModal(false);
        resetForm();
        getNews();
      } else {
        await axiosInstance.post("/news", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("News added successfully!");

        setIsOpenModal(false);
        resetForm();
        getNews();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const openAddModal = () => {
    setIsEditModal(false);
    setNewsDetails({
      title_en: "",
      title_ru: "",
      title_de: "",
      description_en: "",
      description_ru: "",
      description_de: "",
    });
    setIsOpenModal(true);
  };

  const openEditModal = (item) => {
    setIsEditModal(true);
    setEditItemId(item.id);
    setNewsDetails({
      title_en: item.title_en,
      title_de: item.title_de,
      title_ru: item.title_ru,
      description_de: item.description_de,
      description_ru: item.description_ru,
      description_en: item.description_en,
    });
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setNewsDetails({
      title_en: "",
      title_de: "",
      title_ru: "",
      description_de: "",
      description_ru: "",
      description_en: "",
      image: "",
    });
    setIsEditModal(false);
    setEditItemId(null);
  };

  return (
    <div className="ml-72 flex-1 p-6">
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">News</h2>
          <button
            onClick={openAddModal}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add news
          </button>
        </div>
        {isOpenModal && (
          <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
            <div className="w-full max-w-[800px] min-h-[400px] bg-white p-8 rounded-lg">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold mb-4">
                  {isEditModal ? "Edit news" : "Add news"}
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
                {/* ----------------  ------------ English title ------ ----------*/}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="title_en"
                  >
                    Title (English)
                  </label>
                  <input
                    name="title_en"
                    value={newsDetails.title_en}
                    onChange={handleNewsDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="title_en"
                    placeholder="Enter title in English"
                    required
                  />
                  {errors.title_en && (
                    <p style={{ color: "red" }}>{errors.title_en}</p>
                  )}
                </div>

                {/* ------------------------------ Russian title -------------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="title_ru"
                  >
                    Title (Russian)
                  </label>
                  <input
                    name="title_ru"
                    value={newsDetails.title_ru}
                    onChange={handleNewsDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="title_ru"
                    placeholder="Enter title in Russian"
                    required
                  />
                  {errors.title_ru && (
                    <p style={{ color: "red" }}>{errors.title_ru}</p>
                  )}
                </div>

                {/* ------------------------------ German title --------------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="title_de"
                  >
                    Title (German)
                  </label>
                  <input
                    name="title_de"
                    value={newsDetails.title_de}
                    onChange={handleNewsDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="title_de"
                    placeholder="Enter title in German"
                    required
                  />
                  {errors.title_de && (
                    <p style={{ color: "red" }}>{errors.title_de}</p>
                  )}
                </div>

                {/* ------------------------------ English description --------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="description_en"
                  >
                    Description (English)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newsDetails.description_en}
                    onChange={handleNewsDetails}
                    name="description_en"
                    id="description_en"
                    placeholder="  Enter description in English"
                  ></textarea>
                  {errors.description_en && (
                    <p style={{ color: "red" }}>{errors.description_en}</p>
                  )}
                </div>

                {/* ------------------------------ Russian description --------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="description_ru"
                  >
                    Description (Russian)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newsDetails.description_ru}
                    onChange={handleNewsDetails}
                    name="description_ru"
                    id="description_ru"
                    placeholder="  Enter description in Russian"
                  ></textarea>
                  {errors.description_ru && (
                    <p style={{ color: "red" }}>{errors.description_ru}</p>
                  )}
                </div>

                {/* ------------------------------ German description --------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="description_de"
                  >
                    Description (German)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newsDetails.description_de}
                    onChange={handleNewsDetails}
                    name="description_de"
                    id="description_de"
                    placeholder="  Enter description in German"
                  ></textarea>
                  {errors.description_de && (
                    <p style={{ color: "red" }}>{errors.description_de}</p>
                  )}
                </div>

                {/* ------------------------------ Upload files --------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="image"
                  >
                    Upload file
                  </label>
                  <input
                    name="image"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="file"
                    id="image"
                    placeholder="Upload file"
                    accept="image/*"
                  />
                </div>

                <button
                  onClick={(e) => saveNews(e)}
                  className="w-full h-[40px] bg-green-500 text-white font-semibold rounded-md cursor-pointer"
                >
                  {isEditModal ? "Edit news" : "Add news"}
                </button>
              </form>
            </div>
          </div>
        )}
        {isImageModalOpen && (
          <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative">
              <img
                src={selectedImage}
                alt="full-image"
                className="max-w-[90vw] max-h-[90vh] rounded"
              />
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 cursor-pointer"
              >
                ❌
              </button>
            </div>
          </div>
        )}

        {isOpenDeleteModal && (
          <DeleteModal
            deleteItem={() => deleteNews(selectedNews.id)}
            onCancel={() => setIsOpenDeleteModal(false)}
            label="news"
          />
        )}

        <div className="flex flex-col items-center justify-center min-h-28">
          {isLoading ? (
            <div className="flex-col gap-4 w-full flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
              </div>
            </div>
          ) : news.length > 0 ? (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 ">№</th>
                  <th className="border border-gray-300 p-2 ">Image</th>
                  <th className="border border-gray-300 p-2 ">Title (EN)</th>
                  <th className="border border-gray-300 p-2 ">
                    Description (EN)
                  </th>
                  <th className="border border-gray-300 p-2 ">Actions</th>
                </tr>
              </thead>
              {news.map((item, index) => (
                <tbody key={item.id}>
                  <tr className="bg-white text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2 cursor-pointer">
                      <img
                        onClick={() => {
                          setIsImageModalOpen(true);
                          setSelectedImage(
                            `https://testaoron.limsa.uz/${item.image}`
                          );
                        }}
                        src={`https://testaoron.limsa.uz/${item.image}`}
                        alt={item.title_en}
                        className="w-16 h-16 object-cover mx-auto rounded "
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.title_en}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.description_en}
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
                          setSelectedNews(item);
                          setIsOpenDeleteModal(true);
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

export default NewsSection;
