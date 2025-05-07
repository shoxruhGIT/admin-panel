import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [login, setLogin] = useState({
    login: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogin((prevData) => ({ ...prevData, [name]: value }));

    setErrors((prev) => {
      const updatedErrors = { ...prev };

      if (value.trim() !== "") {
        delete updatedErrors[name];
      } else {
        updatedErrors[name] = `${name} should not be empty`;
      }

      if (name === "password" && value.length > 0 && value.length < 5) {
        updatedErrors.password = "Password must be at least 5 characters";
      } else if (name === "password" && value.length >= 5) {
        delete updatedErrors.password;
      }

      return updatedErrors;
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!login.login || !login.password === 0) {
        const newError = {
          login: "Login should not be empty",
          password: "Password should be empty",
        };

        setErrors({ ...newError });
        setIsLoading(false);
      } else {
        const { data } = await axios.post(
          "https://back.ifly.com.uz/api/auth/login",
          login,
          {
            withCredentials: true,
          }
        );

        toast.success(`${data.data.message}`);

        console.log(data);

        setLogin({
          login: "",
          password: "",
        });

        navigation("/");

        localStorage.setItem("accessToken", data.data.access_token);
        setIsLoading(true);
      }
    } catch (error) {
      console.log(error.response);
      toast.error(`${error.message}`);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-[380px] min-h-[330px] rounded-2xl bg-white flex flex-col items-center shadow-xl p-8 gap-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              className="text-[14px] font-bold text-gray-700"
              htmlFor="login"
            >
              Login
            </label>
            <input
              className="border border-gray-300 h-[40px] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="login"
              type="text"
              name="login"
              value={login.login}
              onChange={handleChange}
            />
            {errors.login && <p style={{ color: "red" }}>{errors.login}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-[14px] font-bold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="border border-gray-300 h-[40px] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="password"
              type="password"
              name="password"
              value={login.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password}</p>
            )}
          </div>
          <button
            className={`w-full h-[40px] ${
              isLoading ? "bg-gray-300" : "bg-green-500"
            }  text-white rounded-lg cursor-pointer`}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
