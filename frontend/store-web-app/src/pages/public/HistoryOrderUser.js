import React, { useEffect, useState } from "react";
import {getHistoryOrder} from "../../apis/User";


export default function HistoryOrder() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoryOrder = async () => {
      try {
        const data = await getHistoryOrder();
        console.log(data.response)
        setOrderHistory(data.response);
      } catch (err) {
        setError(err);
      }
    };

    fetchHistoryOrder();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!orderHistory) {
    return <div>Loading...</div>;
  }
  if (orderHistory.length === 0)
    return <h1>No tienes historial de ordenenes hasta la fecha!</h1>;

  return (
    <div className="mt-5">
      <div className="mt-5">
        <h1>Your History Order</h1>
        </div>
      <div class="accordion" id="accordionExample">
      {orderHistory.map((order, index) => (
      <div className="accordion-item" key={index}>
        <h2 className="accordion-header">
          <button
            className="accordion-button text-align-center"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#collapse${index}`}
            aria-expanded="true"
            aria-controls={`collapse${index}`}
          >
            Order {order.order} - Date: {order.date}
          </button>
        </h2>
        <div
          id={`collapse${index}`}
          className="accordion-collapse collapse show"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <h3 className="text-center">Products</h3>
            <table className="table table-striped table-bordered text-center">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Price Unit</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, productIndex) => (
                  <tr key={productIndex}>
                    <td>{product.product}</td>
                    <td>{product.brand}</td>
                    <td>{product.quantity}</td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center mt-4">
              <h3>Shipment: $ {order.shipments}</h3>
              <h3>Total: $ {order.total}</h3>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}
