import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getCategories } from "../apis/Products";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { cartProducts } from "../apis/Cart";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const [cartTotalQuantity, setCartTotalQuantity] = useState(0);

  useEffect(() => {
    const fetchCartProducts = async () => {
      setLoading(true);
      try {
        const data = await cartProducts();
        setCartTotalQuantity(data.total_quantity);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, []);

  console.log("user:", user);
  //console.log(user.token)
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || []); // Ajusta según el nombre de propiedad
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []); // Ejecuta una vez al montar el componente

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  // Manejo de estados de carga y error
  if (loading) return <p>Loading...</p>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div>
      <header className="p-3 text-bg-dark fixed-top">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Link
                to="/"
                className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  fill="currentColor"
                  class="bi bi-cpu mx-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0m-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" />
                </svg>
                KacunaDevice
              </Link>
              <Link to="/about" className="nav-link px-2 ">
                <button class="btn btn-outline-light" type="button">
                  About
                </button>
              </Link>
              <button
                class="btn btn-outline-light"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#staticBackdrop"
                aria-controls="staticBackdrop"
              >
                Categories
              </button>
              <div
                class="offcanvas offcanvas-start"
                data-bs-backdrop="static"
                tabindex="-1"
                id="staticBackdrop"
                aria-labelledby="staticBackdropLabel"
              >
                <div class="offcanvas-header">
                  <h5 class="offcanvas-title mx-2" id="staticBackdropLabel">
                    Categories
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="offcanvas-body">
                  <div>
                    <ul>
                      {categories.map((category) => (
                        <li key={category.category_id}>
                          <Link
                            to={`/category/${category.category_id}`}
                            className="nav-link active"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-tags"
                              viewBox="0 0 16 16"
                            >
                              <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z" />
                              <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z" />
                            </svg>
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <form className="mx-auto" role="search" onSubmit={handleSearch}>
              <input
                type="search"
                className="form-control form-control-dark text-bg-dark"
                placeholder="Search..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <Link to="/cart">
              <button type="button" className="btn btn-dark position-relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-cart-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                </svg>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                  {cartTotalQuantity}
                  <span className="visually-hidden">items in cart</span>
                </span>
              </button>
            </Link>
            <div className="text-end">
              {user ? (
                <>
                  <a
                    href="#"
                    className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      class="bi bi-person-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path
                        fill-rule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                      />
                    </svg>
                  </a>
                  <ul className="dropdown-menu text-small">
                    <li>
                      <Link className="dropdown-item" to="/history-orders">
                        History Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        Sign out
                      </button>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-light me-2"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
