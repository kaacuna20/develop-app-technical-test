import React, { useEffect, useState } from "react";
import { getOrderProducts } from "../../apis/Admin";
import { getOrders } from "../../apis/Admin";
import { getproducts } from "../../apis/Products";

//import "../../AdminPannelStyles.css";

export default function AdminHistorialOrders() {
  const [orderProducts, setOrderProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [ordertId, setOrdertId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await getOrderProducts(ordertId, productId);
      setOrderProducts(data.response);

      // Resetea los valores del formulario después de enviar la solicitud
      setProductId("0"); // Volver a la opción por defecto para productos
      setOrdertId(""); // Volver a la opción por defecto para órdenes
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setAllOrders(data.orders);
      } catch (err) {
        setError(err);
      }
    };

    fetchOrders();
  }, []);

  const handleProductChange = (event) => {
    setProductId(parseInt(event.target.value)); // Convertir el valor a número
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getproducts();
        setProducts(data.products || []); // Ajusta según el nombre de propiedad
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        //toast.error("Failed to fetch categories. Please try again.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Historial Orders</h1>
      <form onSubmit={handleSubmit}>
        <ul className="nav justify-content-center">
          <li className="nav-item">
            <a className="nav-link" href="#">
              <select
                className="form-select"
                id="product"
                value={productId}
                onChange={handleProductChange}
              >
                <option value="0">Products</option>
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <select
                className="form-select"
                id="order"
                value={ordertId}
                onChange={(e) => setOrdertId(e.target.value)}
              >
                <option value="">Orders</option>
                {allOrders.map((order) => (
                  <option key={order.order_id} value={order.order_id}>
                    {order.order_id}
                  </option>
                ))}
              </select>
            </a>
          </li>
          <li className="nav-item">
            <button className="btn btn-secondary mt-2">Filter</button>
          </li>
        </ul>
      </form>

      {/* Show error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          Error 404: Not Found Register
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #444", padding: "10px" }}>
              UserName
            </th>
            <th style={{ borderBottom: "2px solid #444", padding: "10px" }}>
              Product
            </th>
            <th style={{ borderBottom: "2px solid #444", padding: "10px" }}>
              Order
            </th>
          </tr>
        </thead>
        <tbody>
          {orderProducts.map((item, index) => (
            <tr key={index}>
              <td style={{ borderBottom: "2px solid #444", padding: "10px" }}>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                  }}
                >
                  Username: {item.user[0].username}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                  }}
                >
                  Name: {item.buyer[0].fullname}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                  }}
                >
                  Contact: {item.buyer[1].phone}
                </div>
                <div style={{ paddingBottom: "5px" }}>
                  City: {item.buyer[3].city}
                </div>
              </td>
              <td style={{ borderBottom: "2px solid #444", padding: "10px" }}>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                  }}
                >
                  {item.product[1].name}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                  }}
                >
                  Brand: {item.product[2].brand}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                  }}
                >
                  Unit Price: ${item.product[3].price}
                </div>
                <div style={{ paddingBottom: "5px" }}>
                  Quantity: {item.product[4].quantity}
                </div>
              </td>
              <td style={{ borderBottom: "2px solid #444", padding: "10px" }}>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                  }}
                >
                  ID: {item.order[0]["order-id"]}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                  }}
                >
                  {item.order[1].date}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                  }}
                >
                  Shipment: ${item.order[2].shipment}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                  }}
                >
                  Total Products: {item.order[3].total_products}
                </div>
                <div style={{ paddingBottom: "5px" }}>
                  Total Amount: ${item.order[4].total_amount}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
