import React, { useState, useEffect } from "react";
import { searchProducts } from "../../apis/Products";
import { Link, useLocation } from "react-router-dom";

const API_URL = "http://localhost:8000";

export default function SearchPage() {
    const [products, setSearchProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener los parámetros de la consulta desde la URL
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query") || "";

    useEffect(() => {
        const fetchSearchProducts = async () => {
          setLoading(true);
          try {
            const data = await searchProducts(query);
            setSearchProducts(data.response);
            setLoading(false);
          } catch (err) {
            setError(err.message);
            setLoading(false);
          }
        };
    
        fetchSearchProducts();
      }, [query]);

    if (loading) return <p>Loading...</p>;
    if (error) return <h1>Error: {error}</h1>;

    if (products.length === 0) return   <div className="table-responsive mt-5">
      <div className="mt-5"><h1>There were no results for your search!</h1></div></div>;
  return (
    <div className="mt-5">
       <div className="mt-5">
       <h1>Results of your search</h1>
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
                  <p class="card-text">
                    {product.description}
                  </p>
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
    </div>
  )
}
