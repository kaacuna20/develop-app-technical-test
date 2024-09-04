import React, { useState, useEffect } from "react";
import { offertProducts } from "../../apis/Products";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import './../../css/HomePageStyles.css'; 
// Base URL of your FastAPI backend
const API_URL = "http://localhost:8000";

function HomePage() {
  // Estado para almacenar los productos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para llamar a la API cuando el componente se monte
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await offertProducts();
        setProducts(data.response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
        toast.error("Error al obtener los productos: " + error.message);
      }
    };

    fetchProducts();
  }, []);

  // Manejo de estados de carga y error
  if (loading) return <p>Loading...</p>;
  if (error) return <h1>Error: {error}</h1>;

  return (
<div>
  <h1 className="text-center">Productos Recientes</h1>
  <div className="album py-5 bg-body-tertiary">
    <div className="container">
      {products.map((category, index) => (
        <div key={index} className="mb-4">
          <h2 className="text-center mb-3 text-white text-uppercase bg-dark p-2 rounded">{category.category}</h2>
          
          <div className="bg-light p-3 rounded shadow-sm">
            {category.products.length > 0 ? (
              category.products.map((product, idx) => (
                <div key={idx} className="col-12 mb-3">
                  <h3 className="text-center text-dark">{product.name}</h3>
                  <div
                    id={`carouselExampleFade-${index}-${idx}`}
                    className="carousel slide carousel-fade"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner">
                      <Link to={`/${product.slug}`} className="dropdown-item">
                        <div className="carousel-item active">
                          <img
                            src={`${API_URL}/${product.images_url.main_image_url}`}
                            alt={`${product.name} - Main`}
                            className="d-block w-100 rounded-img"
                          />
                        </div>
                        <div className="carousel-item">
                          <img
                            src={`${API_URL}/${product.images_url.second_image_url}`}
                            alt={`${product.name} - Second`}
                            className="d-block w-100 rounded-img"
                          />
                        </div>
                        <div className="carousel-item">
                          <img
                            src={`${API_URL}/${product.images_url.third_image_url}`}
                            alt={`${product.name} - Third`}
                            className="d-block w-100 rounded-img"
                          />
                        </div>
                        <div className="carousel-item">
                          <img
                            src={`${API_URL}/${product.images_url.fourth_image_url}`}
                            alt={`${product.name} - Fourth`}
                            className="d-block w-100 rounded-img"
                          />
                        </div>
                      </Link>
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#carouselExampleFade-${index}-${idx}`}
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#carouselExampleFade-${index}-${idx}`}
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                  <div className="text-center mt-2 text-dark">
                    <h5>{product.brand}</h5>
                    <p>{product.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-dark">No products available in this category.</p>
            )}
          </div>

          {/* Línea divisoria */}
          <hr className="my-4" />
        </div>
      ))}
    </div>
  </div>
</div>


  );
}
  export default HomePage;
  