import axios from "axios";
import React, { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import { toast } from "react-toastify";
import DeleteModal from "../ui/DeleteModal";
import Loading from "../ui/Loading";

const DiscountSection = () => {
  const [discount, setDiscount] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditId, setIsEditId] = useState(null);
  const [isEditModal, setIsEditModal] = useState(false);

  const [isDeleteOpenModal, setIsDeleteOpenModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const token = localStorage.getItem("accessToken");

  const [discountDetails, setDiscountDetails] = useState({
    discount: 0,
    started_at: "",
    finished_at: "",
    status: false,
  });

  const getDiscount = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("https://back.ifly.com.uz/api/discount");
      console.log(data.data);
      setDiscount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getDiscount();
  }, []);

  const deleteDiscount = async (id) => {
    try {
      if (!token) {
        toast.error("Authorization token topilmadi!");
        return;
      }

      await axios.delete(`https://back.ifly.com.uz/api/discount/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Mahsulot muvaffaqiyatli o'chirildi!");
      getDiscount();
      setIsDeleteOpenModal(false);
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

  const saveDiscount = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    try {
      if (
        !discountDetails.discount ||
        !discountDetails.started_at ||
        !discountDetails.finished_at
      ) {
        const newError = {
          discount: "Discount is required",
          started_at: "Started date is required",
          finished_at: "Finished date is required",
        };

        setErrors({ ...newError });
        setIsOpenModal(true);
        setIsLoading(false);
      } else if (isEditModal) {
        await axios.patch(
          `https://back.ifly.com.uz/api/discount/${isEditId}`,
          {
            ...discountDetails,
            discount: parseFloat(discountDetails.discount),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Kategoriya muvaffaqiyatli yangilandi!");
        setIsOpenModal(false); // modalni yopish
        resetForm(); // formani tozalash
        getDiscount();
      } else {
        await axios.post(
          "https://back.ifly.com.uz/api/discount",
          {
            ...discountDetails,
            discount: parseFloat(discountDetails.discount),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Kategoriya muvaffaqiyatli qo‘shildi!");

        setIsOpenModal(false);
        resetForm();
        getDiscount();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const openAddModal = () => {
    setIsEditModal(false);
    setDiscountDetails({
      discount: "",
      started_at: "",
      finished_at: "",
      status: false,
    });
    setIsOpenModal(true);
  };

  const openEditModal = (item) => {
    setIsEditModal(true);
    setIsEditId(item.id);
    setDiscountDetails({
      discount: item.discount,
      started_at: item.started_at,
      finished_at: item.finished_at,
      status: item.status,
    });
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setErrors({ discount: 0, started_at: "", finished_at: "", status: false });
    setIsEditModal(false);
    setIsEditId(null);
  };

  const handleDiscountDetails = (e) => {
    const { name, value } = e.target;
    setDiscountDetails((prevValue) => ({ ...prevValue, [name]: value }));

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (value.trim() !== "") {
        delete updatedErrors[name];
      } else {
        updatedErrors[name] = `${
          name === "discount"
            ? "Discount"
            : name === "started_at"
            ? "Started date"
            : "Finished date"
        } name should not be empty`;
      }

      return updatedErrors;
    });
  };

  return (
    <div className="ml-72 flex-1 p-6">
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Discounts</h2>
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
                    htmlFor="discount"
                  >
                    Discount
                  </label>
                  <input
                    name="discount"
                    value={discountDetails.discount}
                    onChange={handleDiscountDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="number"
                    id="discount"
                    placeholder="Discount %"
                    required
                  />
                  {errors.discount && (
                    <p style={{ color: "red" }}>{errors.discount}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="started_at"
                  >
                    Started Date
                  </label>
                  <input
                    name="started_at"
                    value={discountDetails.started_at}
                    onChange={handleDiscountDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="date"
                    id="started_at"
                    required
                  />
                  {errors.started_at && (
                    <p style={{ color: "red" }}>{errors.started_at}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="finished_at"
                  >
                    Finished Date
                  </label>
                  <input
                    name="finished_at"
                    value={discountDetails.finished_at}
                    onChange={handleDiscountDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="date"
                    id="finished_at"
                    required
                  />
                  {errors.finished_at && (
                    <p style={{ color: "red" }}>{errors.finished_at}</p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="status"
                  >
                    Status
                  </label>
                  <input
                    name="status"
                    checked={discountDetails.status}
                    onChange={(e) =>
                      setDiscountDetails((prevValue) => ({
                        ...prevValue,
                        status: e.target.checked,
                      }))
                    }
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="checkbox"
                    id="status"
                    required
                  />
                </div>
                <button
                  onClick={(e) => saveDiscount(e)}
                  className="w-full h-[40px] bg-green-500 text-white font-semibold rounded-md cursor-pointer"
                >
                  {isEditModal ? "Update category" : "Add category"}
                </button>
              </form>
            </div>
          </div>
        )}
        {isDeleteOpenModal && (
          <DeleteModal
            deleteItem={() => deleteDiscount(selectedDiscount.id)}
            onCancel={() => setIsDeleteOpenModal(false)}
          />
        )}
        <div className="flex flex-col items-center justify-center min-h-28">
          {isLoading ? (
            <div className="flex-col gap-4 w-full flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
              </div>
            </div>
          ) : discount.length > 0 ? (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 ">№</th>
                  <th className="border border-gray-300 p-2 ">Discount (%)</th>
                  <th className="border border-gray-300 p-2 ">Created Date</th>
                  <th className="border border-gray-300 p-2 ">Finished Date</th>
                  <th className="border border-gray-300 p-2 ">Status</th>
                  <th className="border border-gray-300 p-2 ">Actions</th>
                </tr>
              </thead>
              {discount.map((item, index) => (
                <tbody key={item.id}>
                  <tr className="bg-white text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {item?.discount}%
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.started_at}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.finished_at}
                    </td>
                    <td
                      className={`border border-gray-300 p-2 ${
                        item?.status ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {item?.status ? "Active" : "Inactive"}
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
                          setIsDeleteOpenModal(true);
                          setSelectedDiscount(item);
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

export default DiscountSection;
