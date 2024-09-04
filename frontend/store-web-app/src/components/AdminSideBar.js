import React from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function AdminSideBar() {
  const { logout } = useAdmin();
  return (
<div>
  <div
    className="d-flex flex-column flex-shrink-0 p-3"
    style={{ width: "280px", backgroundColor: "#1a1a1a", borderRight: "2px solid #333" }} // Color más oscuro y borde en el lado derecho
  >
    <a
      
      className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
    >
      <svg className="bi pe-none me-2" width="40" height="32">
        <use href="#bootstrap" />
      </svg>
      <span className="fs-4">Admin CRUD</span>
    </a>
    <hr style={{ borderTop: "1px solid #444" }} /> {/* Línea horizontal con un color un poco más claro */}

    <ul className="nav nav-pills flex-column mb-auto">
      <li>
        <Link
          to="/admin/"
          className="nav-link active"
          aria-current="page"
        >
          Main Pannel
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/admin/historial"
          className="nav-link text-white"
          aria-current="page"
        >
          Order Historial
        </Link>
      </li>
      <li>
        <Link
          to="/admin/products/"
          className="nav-link text-white"
          aria-current="page"
        >
          Products
        </Link>
      </li>
      <li>
        <Link
          to="/admin/create-product/"
          className="nav-link text-white"
          aria-current="page"
        >
          Add Product
        </Link>
      </li>
    
      <li>
        <Link
          to="/admin/alter-product"
          className="nav-link text-white"
          aria-current="page"
        >
          Update Product
        </Link>
      </li>
    </ul>
    <hr style={{ borderTop: "1px solid #444" }} /> {/* Otra línea horizontal */}
    {/* Puedes agregar más <hr /> si lo necesitas */}
    <hr style={{ borderTop: "1px solid #444" }} />
    <hr style={{ borderTop: "1px solid #444" }} />
    <hr style={{ borderTop: "1px solid #444" }} />
    <hr style={{ borderTop: "1px solid #444" }} />
    <hr style={{ borderTop: "1px solid #444" }} />
    <hr style={{ borderTop: "1px solid #444" }} />


    <div className="dropdown mt-auto"> {/* mt-auto empuja el dropdown hacia abajo */}
      <a
        href="#"
        className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-lock mx-2" viewBox="0 0 16 16">
  <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1"/>
</svg>
        <strong>Admin</strong>
      </a>
      <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
        <li>
          <a className="dropdown-item" onClick={logout}>
            Sign out
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>

  );
}
