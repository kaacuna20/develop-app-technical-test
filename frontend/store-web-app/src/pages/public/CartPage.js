import React, { useState, useEffect } from "react";
import {
  cartProducts,
  changeQuantityProductCart,
  deleteProductCart, // Importar la función de eliminar producto
} from "../../apis/Cart";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000";

export default function CartPage() {
  const [productsCart, setCartProducts] = useState([]);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [cartTotalQuantity, setCartTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartProducts = async () => {
      setLoading(true);
      try {
        const data = await cartProducts();
        setCartProducts(data.cart);
        setCartTotalPrice(data.total_price);
        setCartTotalQuantity(data.total_quantity);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, []);

  const handleQuantityChange = async (product_id, change) => {
    const actionType = change > 0 ? "plus" : "minus";

    try {
      const response = await changeQuantityProductCart(product_id, actionType);
      const { new_quantity, response: message } = response;

      if (message.includes("maximum stock")) {
        toast.warning(message);
      } else {
        toast.success("Product quantity updated successfully!");
      }

      const updatedCart = productsCart.map((product) => {
        if (product.product_id === product_id) {
          return {
            ...product,
            quantity: new_quantity,
            total: new_quantity * (product.price + product.iva),
          };
        }
        return product;
      });

      setCartProducts(updatedCart);

      const newTotalPrice = updatedCart.reduce(
        (total, product) => total + product.total,
        0
      );
      const newTotalQuantity = updatedCart.reduce(
        (total, product) => total + product.quantity,
        0
      );

      setCartTotalPrice(newTotalPrice);
      setCartTotalQuantity(newTotalQuantity);
    } catch (err) {
      console.log(err);
      toast.error(
        err.message || "An error occurred while updating the item quantity."
      );
    }
  };

  const handleDeleteProduct = async (product_id) => {
    console.log(product_id);
    try {
      const response = await deleteProductCart(product_id);
      toast.success("Product removed from cart!");

      const updatedCart = productsCart.filter(
        (product) => product.product_id !== product_id
      );
      setCartProducts(updatedCart);

      const newTotalPrice = updatedCart.reduce(
        (total, product) => total + product.total,
        0
      );
      const newTotalQuantity = updatedCart.reduce(
        (total, product) => total + product.quantity,
        0
      );

      setCartTotalPrice(newTotalPrice);
      setCartTotalQuantity(newTotalQuantity);
    } catch (err) {
      console.log(err);
      toast.error(
        err.message || "An error occurred while removing the product."
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <h1>Error: {error}</h1>;
  if (productsCart.length === 0)
    return (
      <div className="table-responsive mt-5">
        <div className="mt-5">
          <h1>No devices on your cart!</h1>
        </div>
      </div>
    );

  return (
    <div className="table-responsive mt-5">
      <div className="mt-5">
        <h1>Your Cart</h1>
      </div>

      <table className="table text-center">
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Details</th>
            <th scope="col">Quantity</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {productsCart.map((product) => (
            <tr key={product.product_id}>
              {/* Primera columna: Imagen */}
              <td className="align-middle">
                <Link to={`/${product.slug}`} className="d-block">
                  <img
                    src={`${API_URL}/${product.image_url}`}
                    alt={product.name}
                    className="img-fluid"
                    style={{
                      width: "100px",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />
                </Link>
              </td>
              {/* Segunda columna: Detalles del producto, centrado */}
              <td className="align-middle text-center">
                <div className="d-flex flex-column align-items-center">
                  <h3 className="mb-1">{product.name}</h3>
                  <div className="mb-1">Brand: {product.brand}</div>
                  <div>
                    ${product.price} + ${product.iva} IVA
                  </div>
                </div>
              </td>
              {/* Tercera columna: Controles de cantidad y eliminación, más juntos */}
              <td className="align-middle text-center">
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => handleQuantityChange(product.product_id, -1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id={`quantity-${product.product_id}`}
                    name="quantity"
                    value={product.quantity}
                    min="1"
                    readOnly
                    className="form-control mx-2 text-center"
                    style={{ width: "60px", padding: "0" }}
                  />
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => handleQuantityChange(product.product_id, 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => handleDeleteProduct(product.product_id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                    </svg>
                  </button>
                </div>
              </td>
              {/* Cuarta columna: Total por producto */}
              <td className="align-middle text-center">
                <h4>${product.total}</h4>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center mt-4">
        <h2>Total a pagar: ${cartTotalPrice}</h2>
        <h3>Total artículos: {cartTotalQuantity}</h3>

        <Link to="/checkout" className="nav-link px-2 text-white ms-3">
          <button className="btn btn-primary">Go to CheckOut</button>
        </Link>
      </div>
    </div>
  );
}
