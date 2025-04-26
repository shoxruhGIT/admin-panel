import React from "react";
import Logo from "../assets/logo.png";
import { Link, NavLink } from "react-router";

const PanelSection = () => {
  const menuItems = [
    { name: "Products", to: "/" },
    { name: "Category", to: "/category" },
    { name: "Discount", to: "/discount" },
    { name: "Sizes", to: "/sizes" },
    { name: "Colors", to: "/colors" },
    { name: "Faq", to: "/faq" },
    { name: "Contact", to: "/contact" },
    { name: "Team", to: "/team-members" },
    { name: "News", to: "/news" },
  ];

  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 fixed h-full flex flex-col justify-around items-center gap-8">
      <img className="w-20 h-20" src={Logo} alt="logo" />
      <div className="w-full flex flex-col gap-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `w-full text-center py-2 rounded-lg cursor-pointer ${
                isActive
                  ? "bg-green-500 text-white font-bold"
                  : "hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
      <button
        onClick={handleLogOut}
        className="w-full bg-red-500 rounded-lg py-2 cursor-pointer hover:bg-red-400 duration-200"
      >
        Log out
      </button>
    </div>
  );
};

export default PanelSection;
