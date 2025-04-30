import axios from "axios";
import React, { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import { toast } from "react-toastify";

const SizesSection = () => {
  const [sizes, setSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sizeDetials, setSizeDetials] = useState({
    size: "",
  });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditId, setIsEditId] = useState(null);
  const [isEditModal, setIsEditModal] = useState(false);

  const token = localStorage.getItem("accessToken");

  const getSizes = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("https://back.ifly.com.uz/api/sizes");
      console.log(data.data);
      setSizes(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getSizes();
  }, []);

  const deleteSize = async (id) => {
    try {
      if (!token) {
        toast.error("Authorization token topilmadi!");
        return;
      }

      await axios.delete(`https://back.ifly.com.uz/api/sizes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Mahsulot muvaffaqiyatli o'chirildi!");
      getSizes();
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

  const saveSize = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    try {
      if (!sizeDetials.size) {
        const newError = {
          size: "Size is required",
        };

        setErrors({ ...newError });
        setIsOpenModal(true);
      } else if (isEditModal) {
        await axios.patch(
          `https://back.ifly.com.uz/api/sizes/${isEditId}`,
          sizeDetials,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Kategoriya muvaffaqiyatli yangilandi!");
        setIsOpenModal(false);
        resetForm();
        getSizes();
      } else {
        await axios.post("https://back.ifly.com.uz/api/sizes", sizeDetials, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Kategoriya muvaffaqiyatli qo‘shildi!");

        setIsOpenModal(false);
        resetForm();
        getSizes();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const openAddModal = () => {
    setIsEditModal(false);
    setSizeDetials({
      size: "",
    });
    setIsOpenModal(true);
  };

  const openEditModal = (item) => {
    setIsEditModal(true);
    setIsEditId(item.id);
    setSizeDetials({
      size: item.size,
    });
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setErrors({ size: "" });
    setIsEditModal(false);
    setIsEditId(null);
  };

  const handleSizeDetails = (e) => {
    const { name, value } = e.target;
    setSizeDetials((prevValue) => ({ ...prevValue, [name]: value }));

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
          <h2 className="text-lg font-bold">Sizes</h2>
          <button
            onClick={openAddModal}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add size
          </button>
        </div>
        {isOpenModal && (
          <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
            <div className="w-full max-w-[800px] min-h-[200px] bg-white p-8 rounded-lg">
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
                    htmlFor="size"
                  >
                    Size
                  </label>
                  <input
                    name="size"
                    value={sizeDetials.size}
                    onChange={handleSizeDetails}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="size"
                    placeholder="Size name"
                    required
                  />
                  {errors.size && <p style={{ color: "red" }}>{errors.size}</p>}
                </div>
                <button
                  onClick={(e) => saveSize(e)}
                  className="w-full h-[40px] bg-green-500 text-white font-semibold rounded-md cursor-pointer"
                >
                  {isEditModal ? "Update size" : "Add size"}
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
          ) : sizes.length > 0 ? (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 ">№</th>
                  <th className="border border-gray-300 p-2 ">Sizes</th>
                  <th className="border border-gray-300 p-2 ">Actions</th>
                </tr>
              </thead>
              {sizes.map((item, index) => (
                <tbody key={item.id}>
                  <tr className="bg-white text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{item?.size}</td>

                    <td className="border border-gray-300 p-2 w-50">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-4 py-2 mr-2 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSize(item.id)}
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

export default SizesSection;
