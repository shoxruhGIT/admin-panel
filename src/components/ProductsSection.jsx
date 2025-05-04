"use client";

import { useEffect, useState } from "react";
import NoData from "../assets/no.png";
import axios from "axios";
import { toast } from "react-toastify";
import InputField from "../ui/Input";
import TextareaField from "../ui/Textarea";
import Loading from "../ui/Loading";
import DeleteModal from "../ui/DeleteModal";

const ProductsSection = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeletOpen, setIsDeleteOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [binaryFile, setBinaryFile] = useState(null);
  const [productId, setProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    discount_id: "",
    min_sell: "",
  });

  const token = localStorage.getItem("accessToken");

  const getProduct = async () => {
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

  const getData = async () => {
    try {
      const category = await axios.get("https://back.ifly.com.uz/api/category");
      const sizes = await axios.get("https://back.ifly.com.uz/api/sizes");
      const colors = await axios.get("https://back.ifly.com.uz/api/colors");
      const { data } = await axios.get("https://back.ifly.com.uz/api/discount");
      setDiscount(data.data);
      setColors(colors.data.data);
      setSizes(sizes.data.data);
      setCategory(category.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    getProduct();
  }, []);

  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://back.ifly.com.uz/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product deleted successfully!");
      getProduct();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductDetial = (e) => {
    const { name, value } = e.target;

    setProductDetails((prevData) => ({ ...prevData, [name]: value }));
  };

  const addSize = (sizeObj) => {
    setProductDetails((prev) => {
      const exist = prev.sizes_id.some(
        (size) =>
          (typeof size === "object" && size.id === sizeObj.id) ||
          (typeof size === "string" && size === sizeObj.size)
      );

      if (exist) {
        return prev;
      }

      return { ...prev, sizes_id: [...prev.sizes_id, sizeObj] };
    });
  };

  const addColor = (colorObj) => {
    setProductDetails((prev) => {
      const exist = prev.colors_id.some(
        (color) =>
          (typeof color === "object" && color.id === colorObj.id) ||
          (typeof color === "string" && color === colorObj.color_en)
      );

      if (exist) {
        return prev;
      }

      return {
        ...prev,
        colors_id: [...prev.colors_id, colorObj],
      };
    });
  };

  const openEditModal = (item) => {
    const sizeArray =
      item.sizes?.map((size) => ({
        id: size.id,
        size: size.size,
      })) || [];

    const colorArray = item.colors?.map((color) => ({
      id: color.id,
      color_en: color.color_en,
    }));

    setIsEditModal(true);
    setProductId(item.id);
    setProductDetails({
      title_en: item?.title_en,
      title_ru: item?.title_ru,
      title_de: item?.title_de,
      description_en: item?.description_en,
      description_ru: item?.description_ru,
      description_de: item?.description_de,
      price: item?.price,
      category_id: item?.category?.id,
      sizes_id: sizeArray,
      colors_id: colorArray,
      // images: [],
      discount_id: item?.discount?.id,
      min_sell: item?.min_sell,
    });
    setIsOpenModal(true);
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
      discount_id: "",
      min_sell: "",
      file: "",
    });
    setIsOpenModal(true);
  };

  // -------------------- add and update function ---------------------

  const saveProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title_en", productDetails.title_en);
      formData.append("title_ru", productDetails.title_ru);
      formData.append("title_de", productDetails.title_de);

      formData.append("description_en", productDetails.description_en);
      formData.append("description_ru", productDetails.description_ru);
      formData.append("description_de", productDetails.description_de);

      formData.append("price", productDetails.price);
      formData.append("min_sell", productDetails.min_sell);
      formData.append("category_id", productDetails.category_id);
      formData.append("discount_id", productDetails.discount_id);
      // formData.append("materials", JSON.stringify(productDetails.materials));
      productDetails.sizes_id.forEach((id) => {
        formData.append("sizes_id[]", id.id);
      });

      productDetails.colors_id.forEach((id) => {
        formData.append("colors_id[]", id.id);
      });

      formData.append("files", binaryFile);

      if (isEditModal) {
        await axios.patch(
          `https://back.ifly.com.uz/api/product/${productId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Product updated successfully!");
        setIsOpenModal(false);
        getProduct();
        // resetForm();
      } else {
        await axios.post("https://back.ifly.com.uz/api/product", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product added successfully");
        setIsOpenModal(false);
        getProduct();
        setIsLoading(true);
      }
    } catch (error) {
      console.log(error);

      toast.error("error");
    }
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
                  }}
                  className="text-white bg-red-500 rounded-[50%] h-[35px] w-[35px] flex items-center justify-center cursor-pointer"
                >
                  X
                </button>
              </div>
              <form className="flex flex-col gap-4">
                {/* ---------------------------------- title in english ---------------------------- */}
                <div className="">
                  <InputField
                    label="Product title (EN)"
                    name="title_en"
                    value={productDetails.title_en}
                    onChange={handleProductDetial}
                    placeholder="Enter title in English"
                    required
                  />
                  {/* {errors.name_en && (
                    <p style={{ color: "red" }}>{errors.name_en}</p>
                  )} */}
                </div>

                {/* ---------------------------------- title in russian ---------------------------- */}
                <div className="">
                  <InputField
                    label="Product title (RU)"
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
                  <InputField
                    label="Product title (DE)"
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
                  <TextareaField
                    label="Product description (EN)"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={productDetails.description_en}
                    onChange={handleProductDetial}
                    name="description_en"
                    id="description_en"
                    placeholder="Enter description in English"
                  />
                  {/* {errors.answer_de && (
                    <p style={{ color: "red" }}>{errors.answer_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- description in russian ---------------------------- */}
                <div className="">
                  <TextareaField
                    label="Product description (RU)"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={productDetails.description_ru}
                    onChange={handleProductDetial}
                    name="description_ru"
                    id="description_ru"
                    placeholder="Enter description in Russian"
                  ></TextareaField>
                  {/* {errors.answer_de && (
                    <p style={{ color: "red" }}>{errors.answer_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- description in russian ---------------------------- */}
                <div className="">
                  <TextareaField
                    label="Product description (DE)"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={productDetails.description_de}
                    onChange={handleProductDetial}
                    name="description_de"
                    id="description_de"
                    placeholder="Enter description in German"
                  ></TextareaField>
                  {/* {errors.answer_de && (
                    <p style={{ color: "red" }}>{errors.answer_de}</p>
                  )} */}
                </div>

                {/* ---------------------------------- price section ---------------------------- */}
                <div className="">
                  <InputField
                    label="Price"
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
                  <InputField
                    label="Minimum sel"
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
                    value={productDetails.category_id}
                    onChange={(e) => {
                      const selecteId = Number.parseInt(e.target.value);
                      const selectedCategory = category.find(
                        (cat) => cat.id === selecteId
                      );

                      if (selectedCategory) {
                        setProductDetails((prev) => ({
                          ...prev,
                          category: selectedCategory,
                          category_id: selectedCategory.id,
                        }));
                      }
                    }}
                  >
                    <option value="">Select category</option>
                    {category?.map((item) => (
                      <option key={item.id} value={item.id}>
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
                        <input
                          type="checkbox"
                          id={`size-${item.id}`}
                          value={item.id}
                          checked={productDetails.sizes_id.some(
                            (size) =>
                              (typeof size === "object" &&
                                size.id === item.id) ||
                              (typeof size === "string" && size === item.size)
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              addSize(item);
                            } else {
                              setProductDetails((prev) => ({
                                ...prev,
                                sizes_id: prev.sizes_id.filter(
                                  (size) =>
                                    (typeof size === "object" &&
                                      size.id !== item.id) ||
                                    (typeof size === "string" &&
                                      size !== item.size)
                                ),
                              }));
                            }
                          }}
                        />
                        <label htmlFor={`size-${item.id}`} className="text-sm">
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
                        <input
                          type="checkbox"
                          id={`color-${item.id}`}
                          value={item.id}
                          checked={productDetails.colors_id.some(
                            (color) =>
                              (typeof color === "object" &&
                                color.id === item.id) ||
                              (typeof color === "string" &&
                                color === item.color_en)
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              addColor(item);
                            } else {
                              setProductDetails((prev) => ({
                                ...prev,
                                colors_id: prev.colors_id.filter(
                                  (color) =>
                                    (typeof color === "object" &&
                                      color.id !== item.id) ||
                                    (typeof color === "string" &&
                                      color !== item.color_en)
                                ),
                              }));
                            }
                          }}
                        />
                        <label htmlFor={`color-${item.id}`} className="text-sm">
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
                    value={productDetails.discount_id}
                    onChange={(e) => {
                      const selecteId = Number.parseInt(e.target.value);
                      const selectedDiscount = discount.find(
                        (disc) => disc.id === selecteId
                      );

                      if (selectedDiscount) {
                        setProductDetails((prev) => ({
                          ...prev,
                          discount: selectedDiscount,
                          discount_id: selectedDiscount.id,
                        }));
                      }
                    }}
                  >
                    <option value="">Select discount</option>
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
                <button
                  onClick={(e) => saveProduct(e)}
                  className="w-full h-[40px] bg-green-500 text-white font-semibold rounded-md cursor-pointer"
                >
                  {isEditModal
                    ? "Update product"
                    : isLoading
                    ? "Loading..."
                    : "Add product"}
                </button>
              </form>
            </div>
          </div>
        )}

        {isOpen && (
          <div className="fixed inset-0 bg-gray-900/50 bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative">
              <img
                src={selectedImage || "/placeholder.svg"}
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
          <DeleteModal
            deleteItem={() => deleteItem(selectedProduct.id)}
            onCancel={() => setIsDeleteOpen(false)}
            label="product"
          />
        )}
        <div className="flex flex-col items-center justify-center min-h-28">
          {isLoading ? (
            <Loading />
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
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-4 py-2 mr-2 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteOpen(true);
                          setSelectedProduct(item);
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
              <img
                src={NoData || "/placeholder.svg"}
                alt="No Data"
                className="w-24 h-24 mb-4"
              />
              <p className="text-gray-500">No Data Available</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
