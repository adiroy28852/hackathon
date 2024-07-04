import React from "react";
import Navbar from "../common/navbar";
import Footer from "../common/footer";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
