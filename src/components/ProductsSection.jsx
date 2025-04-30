import React, { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import axios from "axios";
import { toast } from "react-toastify";

const ProductsSection = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeletOpen, setIsDeleteOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [prodyctId, setProductId] = useState(null);

  const [category, setCategory] = useState({});
  const [sizes, setSizes] = useState({});
  const [colors, setColors] = useState({});
  const [discount, setDiscount] = useState({});

  const [productDetails, setProductDetails] = useState({
    title_en: "",
    title_ru: "",
    title_de: "",
    description_en: "",
    description_ru: "",
    description_de: "",
    price: "",
    category_id: "",
    sizes_id: [],
    colors_id: [],
    images: [],
    materials: {},
    discount_id: "",
    min_sell: "",
  });

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
    getData();
    getCategory();
    getSizes();
    getColors();
    getDiscount();
  }, []);

  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://back.ifly.com.uz/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Mahsulot muvaffaqiyatli o'chirildi!");
      getData();
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

  const handleProductDetial = (e) => {
    const { name, value } = e.target;

    setProductDetails((prevData) => ({ ...prevData, [name]: value }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://back.ifly.com.uz/api/discount",
        productDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("added successfully");
    } catch (error) {
      console.log(error);

      toast.error("error");
    }
  };

  const openAddModal = () => {
    setIsEditModal(false);
    setProductDetails({
      title_en: "",
      title_ru: "",
      title_de: "",
      description_en: "",
      description_ru: "",
      description_de: "",
      price: "",
      category_id: "",
      sizes_id: [],
      colors_id: [],
      images: [],
      materials: {},
      discount_id: "",
      min_sell: "",
    });
    setIsOpenModal(true);
  };

  return (
    <div className="ml-72 flex-1 p-6">
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Products</h2>
          <button
            onClick={openAddModal}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add Product
          </button>
        </div>
        {isOpenModal && (
          <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold mb-4">
                  {isEditModal ? "Edit product" : "Add product"}
                </h1>
                <button
                  onClick={() => {
                    setIsOpenModal(false);
                    // resetForm();
                  }}
                  className="text-white bg-red-500 rounded-[50%] h-[35px] w-[35px] flex items-center justify-center cursor-pointer"
                >
                  X
                </button>
              </div>
              <form className="flex flex-col gap-4">
                {/* ---------------------------------- title in english ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="title_en"
                  >
                    Product title (EN)
                  </label>
                  <input
                    name="title_en"
                    value={productDetails.title_en}
                    onChange={handleProductDetial}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="title_en"
                    placeholder="Enter title in english"
                    required
                  />
                  {/* {errors.name_en && (
                    <p style={{ color: "red" }}>{errors.name_en}</p>
                  )} */}
                </div>

                {/* ---------------------------------- title in russian ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="title_ru"
                  >
                    Product title (RU)
                  </label>
                  <input
                    name="title_ru"
                    value={productDetails.title_ru}
                    onChange={handleProductDetial}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="title_ru"
                    placeholder="Enter title in russian"
                    required
                  />
                  {/* {errors.name_ru && (
                    <p style={{ color: "red" }}>{errors.name_ru}</p>
                  )} */}
                </div>

                {/* ---------------------------------- title in german ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="title_de"
                  >
                    Product title (DE)
                  </label>
                  <input
                    name="title_de"
                    value={productDetails.title_de}
                    onChange={handleProductDetial}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="text"
                    id="title_de"
                    placeholder="Enter title in german"
                    required
                  />
                  {/* {errors.name_de && (
                    <p style={{ color: "red" }}>{errors.name_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- description in english ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="description_en"
                  >
                    Product description (EN)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={productDetails.description_en}
                    onChange={handleProductDetial}
                    name="description_en"
                    id="description_en"
                    placeholder="Enter description in English"
                  ></textarea>
                  {/* {errors.answer_de && (
                    <p style={{ color: "red" }}>{errors.answer_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- description in russian ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="description_ru"
                  >
                    Product description (RU)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={productDetails.description_ru}
                    onChange={handleProductDetial}
                    name="description_ru"
                    id="description_ru"
                    placeholder="Enter description in Russian"
                  ></textarea>
                  {/* {errors.answer_de && (
                    <p style={{ color: "red" }}>{errors.answer_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- description in russian ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="description_de"
                  >
                    Product description (DE)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={productDetails.description_de}
                    onChange={handleProductDetial}
                    name="description_de"
                    id="description_de"
                    placeholder="Enter description in German"
                  ></textarea>
                  {/* {errors.answer_de && (
                    <p style={{ color: "red" }}>{errors.answer_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- price section ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="price"
                  >
                    Price
                  </label>
                  <input
                    name="price"
                    value={productDetails.price}
                    onChange={handleProductDetial}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="number"
                    id="price"
                    placeholder="Enter price"
                    required
                  />
                  {/* {errors.name_de && (
                    <p style={{ color: "red" }}>{errors.name_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- min-sell section ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="min_sell"
                  >
                    Minimum sel
                  </label>
                  <input
                    name="min_sell"
                    value={productDetails.min_sell}
                    onChange={handleProductDetial}
                    className="w-full border rounded-md h-[40px] p-4 border-gray-300"
                    type="number"
                    id="min_sell"
                    placeholder="Enter min sell"
                    required
                  />
                  {/* {errors.name_de && (
                    <p style={{ color: "red" }}>{errors.name_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- category section ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="category_id"
                  >
                    Category
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                    name="category_id"
                    id="category_id"
                  >
                    {category.map((item) => (
                      <option key={item.id} value={item.id} onChange={handleProductDetial}>
                        {item.name_en}
                      </option>
                    ))}
                  </select>
                  {/* {errors.name_de && (
                    <p style={{ color: "red" }}>{errors.name_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- size section ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="sizes_id"
                  >
                    Sizes
                  </label>
                  <div className="flex flex-wrap items-center gap-4">
                    {sizes.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <input type="checkbox" id="size" value={item.id} />
                        <label htmlFor="size" className="text-sm">
                          {item.size}
                        </label>
                      </div>
                    ))}
                  </div>
                  {/* {errors.name_de && (
                    <p style={{ color: "red" }}>{errors.name_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- color section ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="colors_id"
                  >
                    Colors
                  </label>
                  <div className="flex flex-wrap items-center gap-4">
                    {colors.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <input type="checkbox" id="size" value={item.id} />
                        <label htmlFor="size" className="text-sm">
                          {item.color_en}
                        </label>
                      </div>
                    ))}
                  </div>
                  {/* {errors.name_de && (
                    <p style={{ color: "red" }}>{errors.name_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- discount section ---------------------------- */}
                <div className="">
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="discount_id"
                  >
                    Discount
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                    name="discount_id"
                    id="discount_id"
                  >
                    {discount.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.discount}
                      </option>
                    ))}
                  </select>
                  {/* {errors.name_de && (
                    <p style={{ color: "red" }}>{errors.name_de}</p>
                  )} */}
                </div>
                <button
                  onClick={(e) => saveProduct(e)}
                  className="w-full h-[40px] bg-green-500 text-white font-semibold rounded-md cursor-pointer"
                >
                  {isEditModal ? "Update product" : "Add product"}
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
          ) : data.length > 0 ? (
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
