import React, { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import axios from "axios";
import { toast } from "react-toastify";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import axiosInstance from "../services/axiosIntance";

const ContactSection = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const token = localStorage.getItem("accessToken");

  const [contactDetails, setContactDetails] = useState({
    phone_number: "",
    email: "",
    address_en: "",
    address_ru: "",
    address_de: "",
  });

  // ======================================================== Start get category function ========================================================
  const getContact = async () => {
    try {
      setIsLoading(true);
      const category = await axios.get("https://testaoron.limsa.uz/api/contact");
      setContacts(category.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getContact();
  }, []);
  // ======================================================== end get category function ========================================================

  // start delete category function ========================================================
  const deleteContact = async (id) => {
    try {
      if (!token) {
        toast.error("Authorization token topilmadi!");
        return;
      }

      await axiosInstance.delete(`/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Mahsulot muvaffaqiyatli o'chirildi!");
      getContact();
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
  const handleContactDetails = (e) => {
    const { name, value } = e.target;

    setContactDetails((prevData) => ({ ...prevData, [name]: value }));

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (value.trim() !== "") {
        delete updatedErrors[name];
      } else {
        updatedErrors[name] = `${
          name === "phone_number"
            ? "Phone number"
            : name === "email"
            ? "Email"
            : name === "address_en"
            ? "English name"
            : name === "address_ru"
            ? "Russian name"
            : "German name"
        } should not be empty`;
      }

      return updatedErrors;
    });
  };

  // ======================================================== start update category function ========================================================
  const saveContact = async (e) => {
    e.preventDefault();

    try {
      if (
        !contactDetails.phone_number ||
        !contactDetails.email ||
        !contactDetails.address_de ||
        !contactDetails.address_en ||
        !contactDetails.address_ru
      ) {
        const newError = {
          phone_number: "Phone number should not be empty",
          email: "Email should not be empty",
          address_en: "English name should not be empty",
          address_ru: "Russian name should not be empty",
          address_de: "German name should not be empty",
        };

        setErrors({ ...newError });
        setIsOpenModal(true);
      } else if (isEditModal) {
        await axiosInstance.patch(`/contact/${editItemId}`, contactDetails, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Kategoriya muvaffaqiyatli yangilandi!");
        setIsOpenModal(false);
        resetForm();
        getContact();
      } else {
        await axiosInstance.post("/contact", contactDetails, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Kategoriya muvaffaqiyatli qo‘shildi!");

        setIsOpenModal(false);
        resetForm();
        getContact();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const openAddModal = () => {
    setIsEditModal(false);
    setContactDetails({
      phone_number: "",
      email: "",
      address_de: "",
      address_en: "",
      address_ru: "",
    });
    setIsOpenModal(true);
  };

  const openEditModal = (item) => {
    setIsEditModal(true);
    setEditItemId(item.id);
    setContactDetails({
      phone_number: item.phone_number,
      email: item.email,
      address_en: item.address_en,
      address_ru: item.address_ru,
      address_de: item.address_de,
    });
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setContactDetails({
      phone_number: "",
      email: "",
      address_en: "",
      address_ru: "",
      address_de: "",
    });
    setIsEditModal(false);
    setEditItemId(null);
  };

  return (
    <div className="ml-72 flex-1 p-6">
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Contacts</h2>
          <button
            onClick={openAddModal}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add contact
          </button>
        </div>
        {isOpenModal && (
          <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
            <div className="w-full max-w-[800px] min-h-[400px] bg-white p-8 rounded-lg">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold mb-4">
                  {isEditModal ? "Edit contact" : "Add contact"}
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
                    htmlFor="phone_number"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    name="phone_number"
                    country={"uz"}
                    value={contactDetails.phone_number}
                    onChange={(value) =>
                      setContactDetails((prev) => ({
                        ...prev,
                        phone_number: value,
                      }))
                    }
                    inputStyle={{ width: "100%" }}
                    type="number"
                    id="question_en"
                    placeholder="Enter phone number"
                    required
                  />
                  {errors.phone_number && (
                    <p style={{ color: "red" }}>{errors.phone_number}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    value={contactDetails.email}
                    onChange={handleContactDetails}
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p style={{ color: "red" }}>{errors.email}</p>
                  )}
                </div>
                {/* ---------------- end English FAQs ------ ----------*/}

                {/* ---------------- start Russian FAQs ------ ----------*/}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="address_en"
                  >
                    Address (EN)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={contactDetails.address_en}
                    onChange={handleContactDetails}
                    name="address_en"
                    id="address_en"
                    placeholder="Address (EN)"
                  ></textarea>
                  {errors.address_en && (
                    <p style={{ color: "red" }}>{errors.address_en}</p>
                  )}
                </div>
                {/* ---------------- end Russian FAQs ------ ----------*/}

                {/* ---------------- Start German FAQs ------ ----------*/}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="address_ru"
                  >
                    Address (RU)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={contactDetails.address_ru}
                    onChange={handleContactDetails}
                    name="address_ru"
                    id="address_ru"
                    placeholder="Address (RU)"
                  ></textarea>
                  {errors.address_ru && (
                    <p style={{ color: "red" }}>{errors.address_ru}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="address_de"
                  >
                    Address (DE)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={contactDetails.address_de}
                    onChange={handleContactDetails}
                    name="address_de"
                    id="address_de"
                    placeholder="Address (DE)"
                  ></textarea>
                  {errors.address_de && (
                    <p style={{ color: "red" }}>{errors.address_de}</p>
                  )}
                </div>
                {/* ---------------- end German FAQs ------ ----------*/}

                <button
                  onClick={(e) => saveContact(e)}
                  className="w-full h-[40px] bg-green-500 text-white font-semibold rounded-md cursor-pointer"
                >
                  {isEditModal ? "Edit contact" : "Add contact"}
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
          ) : contacts.length > 0 ? (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 ">№</th>
                  <th className="border border-gray-300 p-2 ">Phone Number</th>
                  <th className="border border-gray-300 p-2 ">Email</th>
                  <th className="border border-gray-300 p-2 ">Address (EN)</th>
                  <th className="border border-gray-300 p-2 ">Actions</th>
                </tr>
              </thead>
              {contacts.map((item, index) => (
                <tbody key={item.id}>
                  <tr className="bg-white text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {item?.phone_number}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.email}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.address_en}
                    </td>
                    <td className="border border-gray-300 p-2 w-50">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-4 py-2 mr-2 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteContact(item.id)}
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

export default ContactSection;
