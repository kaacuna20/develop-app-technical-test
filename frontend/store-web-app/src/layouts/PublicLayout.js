import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div>
      <Navbar />

      <main>
        <Outlet /> {/* Esto renderiza el contenido de las rutas anidadas */}
      </main>

      <Footer />
    </div>
  );
}

export default PublicLayout;
