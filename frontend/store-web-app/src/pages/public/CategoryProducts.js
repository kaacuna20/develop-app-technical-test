import React, { useState, useEffect } from "react";
import { filterByCategory } from "../../apis/Products";
import { useParams, useSearchParams, Link } from "react-router-dom";
import "./../../css/CategoryStyle.css";

// Base URL of your FastAPI backend
const API_URL = "http://localhost:8000";

export default function CategoryProducts() {
  const { category_id } = useParams(); // Obtener category_id de la URL
  const [searchParams, setSearchParams] = useSearchParams(); // Para manejar los query parameters
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [size] = useState(10); // Tamaño de la página fijo en 10

  // Obtener la página actual de los query params, si no está, usar 1 por defecto
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await filterByCategory(category_id, page, size);
        setProducts(data.response);
        setTotal(data.total); // Aquí guardas el total de productos
        setCategory(data.category);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category_id, page, size]); // Vuelve a hacer la solicitud cuando cambia la página

  const totalPages = Math.ceil(total / size); // Calcula el número total de páginas

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  if (products.length === 0)
    return (
      <div className="table-responsive mt-5">
        <div className="mt-5">
          <h1>There are not devices for this category!</h1>
        </div>
      </div>
    );

  return (
    <div className="'profile-container mt-5">
      <div className="mt-5">
        <ul class="nav justify-content-center">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">
              Active
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              Link
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              Link
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" aria-disabled="true">
              Disabled
            </a>
          </li>
        </ul>
      </div>
      <div className="mt-5">
        <h1>{category}</h1>
      </div>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {loading && <p>Loading...</p>}
        {!loading && error && <p>Error: {error}</p>}

        {!loading &&
          !error &&
          products.map((product) => (
            <div class="col">
              <div class="card shadow-sm">
                <Link to={`/${product.slug}`} className="dropdown-item">
                  <img
                    src={`${API_URL}/${product.images_url.main_image_url}`}
                    alt={`${product.name} - Main`}
                    className="d-block w-100 rounded-img"
                  />
                </Link>
                <div class="card-body">
                  <h3>{product.name}</h3>
                  <p class="card-text">{product.description}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <h5>$ {product.price}</h5>
                    </div>
                    <small class="text-body-secondary">{product.brand}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(page - 1)}
              aria-label="Previous"
              disabled={page === 1}
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i + 1}
              className={`page-item ${page === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(page + 1)}
              aria-label="Next"
              disabled={page === totalPages}
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
