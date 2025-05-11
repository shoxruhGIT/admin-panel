import axios from "axios";
import React, { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosIntance";

const ColorsSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const token = localStorage.getItem("accessToken");

  const [faqDetails, setFaqDetails] = useState({
    question_en: "",
    question_ru: "",
    question_de: "",
    answer_en: "",
    answer_ru: "",
    answer_de: "",
  });

  // ======================================================== Start get category function ========================================================
  const getFaqs = async () => {
    try {
      setIsLoading(true);
      const category = await axios.get("https://testaoron.limsa.uz/api/faq");
      setFaqs(category.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getFaqs();
  }, []);
  // ======================================================== end get category function ========================================================

  // start delete category function ========================================================
  const deleteFaq = async (id) => {
    try {
      if (!token) {
        toast.error("Authorization token topilmadi!");
        return;
      }

      await axiosInstance.delete(`/faq/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Mahsulot muvaffaqiyatli o'chirildi!");
      getFaqs();
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
  const handleFaqDetails = (e) => {
    const { name, value } = e.target;

    setFaqDetails((prevData) => ({ ...prevData, [name]: value }));

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (value.trim() !== "") {
        delete updatedErrors[name];
      } else {
        updatedErrors[name] = `${
          name === "question_en"
            ? "English"
            : name === "question_ru"
            ? "Russian"
            : name === "question_de"
            ? "German"
            : name === "answer_en"
            ? "English"
            : name === "answer_ru"
            ? "Russian"
            : "German"
        } name should not be empty`;
      }

      return updatedErrors;
    });
  };

  // ======================================================== start update category function ========================================================
  const saveFaq = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    try {
      if (
        !faqDetails.question_en ||
        !faqDetails.question_ru ||
        !faqDetails.question_de ||
        !faqDetails.answer_en ||
        !faqDetails.answer_ru ||
        !faqDetails.answer_de
      ) {
        const newError = {
          question_en: "Enlish name should not be empty",
          question_ru: "Russian name should not be empty",
          question_de: "German name should not be empty",
          answer_en: "Enlish name should not be empty",
          answer_ru: "Russian name should not be empty",
          answer_de: "German name should not be empty",
        };

        setErrors({ ...newError });
        setIsOpenModal(true);
      } else if (isEditModal) {
        await axiosInstance.patch(`/faq/${editItemId}`, faqDetails, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Kategoriya muvaffaqiyatli yangilandi!");
        setIsOpenModal(false);
        resetForm();
        getFaqs();
      } else {
        await axiosInstance.post("/faq", faqDetails, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Kategoriya muvaffaqiyatli qo‘shildi!");

        setIsOpenModal(false);
        resetForm();
        getFaqs();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const openAddModal = () => {
    setIsEditModal(false);
    setFaqDetails({
      question_en: "",
      question_ru: "",
      question_de: "",
      answer_en: "",
      answer_ru: "",
      answer_de: "",
    });
    setIsOpenModal(true);
  };

  const openEditModal = (item) => {
    setIsEditModal(true);
    setEditItemId(item.id);
    setFaqDetails({
      question_en: item.question_en,
      question_de: item.question_de,
      question_ru: item.question_ru,
      answer_en: item.answer_en,
      answer_ru: item.answer_ru,
      answer_de: item.answer_de,
    });
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setFaqDetails({
      question_en: "",
      question_ru: "",
      question_de: "",
      answer_en: "",
      answer_ru: "",
      answer_de: "",
    });
    setIsEditModal(false);
    setEditItemId(null);
  };

  return (
    <div className="ml-72 flex-1 p-6">
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Faqs</h2>
          <button
            onClick={openAddModal}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add faq
          </button>
        </div>
        {isOpenModal && (
          <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
            <div className="w-full max-w-[800px] min-h-[400px] bg-white p-8 rounded-lg">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold mb-4">
                  {isEditModal ? "Edit faq" : "Add faq"}
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
                {/* ---------------- start English FAQs ------ ----------*/}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="question_en"
                  >
                    Question (English)
                  </label>
                  <input
                    name="question_en"
                    value={faqDetails.question_en}
                    onChange={handleFaqDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="question_en"
                    placeholder="Enter question in English"
                    required
                  />
                  {errors.question_en && (
                    <p style={{ color: "red" }}>{errors.question_en}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="answer_en"
                  >
                    Answer (English)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={faqDetails.answer_en}
                    onChange={handleFaqDetails}
                    name="answer_en"
                    id="answer_en"
                    placeholder="  Enter answer in English"
                  ></textarea>
                  {errors.answer_en && (
                    <p style={{ color: "red" }}>{errors.answer_en}</p>
                  )}
                </div>
                {/* ---------------- end English FAQs ------ ----------*/}

                {/* ---------------- start Russian FAQs ------ ----------*/}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="question_ru"
                  >
                    Question (Russian)
                  </label>
                  <input
                    name="question_ru"
                    value={faqDetails.question_ru}
                    onChange={handleFaqDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="question_ru"
                    placeholder="Enter question in Russian"
                    required
                  />
                  {errors.question_ru && (
                    <p style={{ color: "red" }}>{errors.question_ru}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="answer_ru"
                  >
                    Answer (Russian)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={faqDetails.answer_ru}
                    onChange={handleFaqDetails}
                    name="answer_ru"
                    id="answer_ru"
                    placeholder="  Enter answer in Russian"
                  ></textarea>
                  {errors.answer_ru && (
                    <p style={{ color: "red" }}>{errors.answer_ru}</p>
                  )}
                </div>
                {/* ---------------- end Russian FAQs ------ ----------*/}

                {/* ---------------- Start German FAQs ------ ----------*/}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="question_de"
                  >
                    Question (German)
                  </label>
                  <input
                    name="question_de"
                    value={faqDetails.question_de}
                    onChange={handleFaqDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="question_de"
                    placeholder="Enter question in German"
                    required
                  />
                  {errors.question_de && (
                    <p style={{ color: "red" }}>{errors.question_de}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="answer_de"
                  >
                    Answer (German)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={faqDetails.answer_de}
                    onChange={handleFaqDetails}
                    name="answer_de"
                    id="answer_de"
                    placeholder="  Enter answer in German"
                  ></textarea>
                  {errors.answer_de && (
                    <p style={{ color: "red" }}>{errors.answer_de}</p>
                  )}
                </div>
                {/* ---------------- end German FAQs ------ ----------*/}

                <button
                  onClick={(e) => saveFaq(e)}
                  className="w-full h-[40px] bg-green-500 text-white font-semibold rounded-md cursor-pointer"
                >
                  {isEditModal ? "Edit faq" : "Add faq"}
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
          ) : faqs.length > 0 ? (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 ">№</th>
                  <th className="border border-gray-300 p-2 ">Qestion ENG</th>
                  <th className="border border-gray-300 p-2 ">Answer RU</th>
                  <th className="border border-gray-300 p-2 ">Actions</th>
                </tr>
              </thead>
              {faqs.map((item, index) => (
                <tbody key={item.id}>
                  <tr className="bg-white text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {item?.question_en}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.answer_en}
                    </td>
                    <td className="border border-gray-300 p-2 w-50">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-4 py-2 mr-2 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFaq(item.id)}
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
