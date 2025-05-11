import React, { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import axios from "axios";
import { toast } from "react-toastify";

const TeamSection = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [binaryFile, setBinaryFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("accessToken");

  const [teamDetails, setTeamDetails] = useState({
    image: "",
    full_name: "",
    position_de: "",
    position_ru: "",
    position_en: "",
  });

  // ======================================================== Start get team-members function ========================================================
  const getTeams = async () => {
    try {
      setIsLoading(true);
      const members = await axios.get(
        "https://testaoron.limsa.uz/api/team-section"
      );
      setTeams(members.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getTeams();
  }, []);
  // ======================================================== end get team-members function ========================================================

  // ======================================================== start delete team-members function ========================================================
  const deleteTeamItem = async (id) => {
    try {
      if (!token) {
        toast.error("Authorization token topilmadi!");
        return;
      }

      await axios.delete(`https://back.ifly.com.uz/api/team-section/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Mahsulot muvaffaqiyatli o'chirildi!");
      getTeams();
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
  // ======================================================== end delete team-members function ========================================================

  // ======================================================== start add team-members function ========================================================
  const handleTeamDetails = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      setTeamDetails((prevData) => ({ ...prevData, image: files[0] }));
      return;
    }

    setTeamDetails((prevData) => ({ ...prevData, [name]: value }));

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (value.trim() !== "") {
        delete updatedErrors[name];
      } else {
        updatedErrors[name] = `${
          name === "full_name"
            ? "Full name"
            : name === "position_en"
            ? "English name"
            : name === "position_ru"
            ? "Russian name"
            : "German name"
        } should not be empty`;
      }

      return updatedErrors;
    });
  };

  // ======================================================== start update team-members function ========================================================
  const saveTeam = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("file", binaryFile);
    formData.append("full_name", teamDetails.full_name);
    formData.append("position_en", teamDetails.position_en);
    formData.append("position_ru", teamDetails.position_ru);
    formData.append("position_de", teamDetails.position_de);

    console.log(formData);

    try {
      if (
        !teamDetails.full_name ||
        !teamDetails.position_de ||
        !teamDetails.position_en ||
        !teamDetails.position_ru
      ) {
        const newError = {
          image: "Image should not be empty",
          full_name: "Full name should not be empty",
          position_en: "English name should not be empty",
          position_ru: "Russian name should not be empty",
          position_de: "German name should not be empty",
        };

        setErrors({ ...newError });
        setIsOpenModal(true);
      } else if (isEditModal) {
        await axios.patch(
          `https://back.ifly.com.uz/api/team-section/${editItemId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Kategoriya muvaffaqiyatli yangilandi!");
        setIsOpenModal(false);
        resetForm();
        getTeams();
      } else {
        await axios.post(
          "https://back.ifly.com.uz/api/team-section",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Kategoriya muvaffaqiyatli qo‘shildi!");

        setIsOpenModal(false);
        resetForm();
        getTeams();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const openAddModal = () => {
    setIsEditModal(false);
    setTeamDetails({
      image: "",
      full_name: "",
      position_de: "",
      position_en: "",
      position_ru: "",
    });
    setIsOpenModal(true);
  };

  const openEditModal = (item) => {
    setIsEditModal(true);
    setEditItemId(item.id);
    setTeamDetails({
      image: item.image,
      full_name: item.full_name,
      position_de: item.position_de,
      position_en: item.position_en,
      position_ru: item.position_ru,
    });
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setTeamDetails({
      image: "",
      full_name: "",
      position_de: "",
      position_en: "",
      position_ru: "",
    });
    setIsEditModal(false);
    setEditItemId(null);
  };

  return (
    <div className="ml-72 flex-1 p-6">
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Teams members</h2>
          <button
            onClick={openAddModal}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add Team Members
          </button>
        </div>
        {isOpenModal && (
          <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
            <div className="w-full max-w-[800px] min-h-[400px] bg-white p-8 rounded-lg">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold mb-4">
                  {isEditModal ? "Edit team members" : "Add team members"}
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
                {/* ---------------- start full name section ------ ----------*/}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="full_name"
                  >
                    Full name
                  </label>
                  <input
                    name="full_name"
                    value={teamDetails.full_name}
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={handleTeamDetails}
                    type="text"
                    id="full_name"
                    placeholder="Enter your full name"
                    required
                  />
                  {errors.full_name && (
                    <p style={{ color: "red" }}>{errors.full_name}</p>
                  )}
                </div>
                {/* ---------------- end full name section ------ ----------*/}

                {/* ---------------- start position english section ------ ----------*/}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="position_en"
                  >
                    Position (English)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    value={teamDetails.position_en}
                    onChange={handleTeamDetails}
                    name="position_en"
                    id="position_en"
                    type="text"
                    placeholder="Enter English name"
                  />
                  {errors.position_en && (
                    <p style={{ color: "red" }}>{errors.position_en}</p>
                  )}
                </div>
                {/* ---------------- end position english section ------ ----------*/}

                {/* ---------------- start position russian section ------ ----------*/}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="position_ru"
                  >
                    Position (Russian)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    value={teamDetails.position_ru}
                    onChange={handleTeamDetails}
                    name="position_ru"
                    id="position_ru"
                    type="text"
                    placeholder="Enter Russian name"
                  />
                  {errors.position_ru && (
                    <p style={{ color: "red" }}>{errors.position_ru}</p>
                  )}
                </div>
                {/* ---------------- end position russian section ------ ----------*/}

                {/* ---------------- start position german section ------ ----------*/}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="position_de"
                  >
                    Position (German)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    value={teamDetails.position_de}
                    onChange={handleTeamDetails}
                    name="position_de"
                    id="position_de"
                    type="text"
                    placeholder="Enter German name"
                  />
                  {errors.position_de && (
                    <p style={{ color: "red" }}>{errors.position_de}</p>
                  )}
                </div>
                {/* ---------------- end position german section ------ ----------*/}

                {/* ---------------- start image section ------ ----------*/}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="image"
                  >
                    Upload Image
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={(e) => setBinaryFile(e.target.files[0])}
                    name="image"
                    id="image"
                    type="file"
                    accept="image/*"
                  />
                </div>
                {/* ---------------- end image section ------ ----------*/}

                <button
                  onClick={(e) => saveTeam(e)}
                  className="w-full h-[40px] bg-green-500 text-white font-semibold rounded-md cursor-pointer"
                >
                  {isEditModal ? "Edit Team Members" : "Add Team Members"}
                </button>
              </form>
            </div>
          </div>
        )}
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
        
        <div className="flex flex-col items-center justify-center min-h-28">
          {isLoading ? (
            <div className="flex-col gap-4 w-full flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
              </div>
            </div>
          ) : teams.length > 0 ? (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 ">№</th>
                  <th className="border border-gray-300 p-2 ">Images</th>
                  <th className="border border-gray-300 p-2 ">Full name</th>
                  <th className="border border-gray-300 p-2 ">Position (EN)</th>
                  <th className="border border-gray-300 p-2 ">Actions</th>
                </tr>
              </thead>
              {teams.map((item, index) => (
                <tbody key={item.id}>
                  <tr className="bg-white text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      <img
                        src={`https://testaoron.limsa.uz/${item.image}`}
                        alt="Product"
                        className="mx-auto rounded-sm w-15 h-15"
                        onClick={() => {
                          setIsOpen(true);
                          setSelectedImage(
                            `https://testaoron.limsa.uz/${item.image}`
                          );
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.full_name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.position_en}
                    </td>
                    <td className="border border-gray-300 p-2 w-50">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-4 py-2 mr-2 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTeamItem(item.id)}
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

export default TeamSection;
