import React from "react";
import PanelSection from "./PanelSection";
import { Route, Routes } from "react-router-dom";
import {
  CategorySection,
  ColorsSection,
  ContactSection,
  DiscountSection,
  FaqSection,
  NewsSection,
  ProductsSection,
  SizesSection,
  TeamSection,
} from "./index";

const AdminPanel = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <PanelSection />

      <Routes>
        <Route path="/" element={<ProductsSection />} />
        <Route path="/category" element={<CategorySection />} />
        <Route path="/discount" element={<DiscountSection />} />
        <Route path="/sizes" element={<SizesSection />} />
        <Route path="/colors" element={<ColorsSection />} />
        <Route path="/faq" element={<FaqSection />} />
        <Route path="/contact" element={<ContactSection />} />
        <Route path="/team-members" element={<TeamSection />} />
        <Route path="/news" element={<NewsSection />} />
      </Routes>
    </div>
  );
};

export default AdminPanel;
