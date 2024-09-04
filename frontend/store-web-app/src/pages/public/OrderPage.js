import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderDetails } from "../../apis/Order";

// Base URL of your FastAPI backend
const API_URL = "http://localhost:8000";

export default function Order() {
  const { order_id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await getOrderDetails(order_id);
        setOrderDetails(data);
      } catch (err) {
        setError(err);
      }
    };

    fetchOrderDetail();
  }, [order_id]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  if (!orderDetails.products || orderDetails.products.length === 0) {
    return <h1>No hay datos de esa orden</h1>;
  }

  return (
    <div>
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <h6 className="border-bottom pb-2 mb-0">Order {order_id}</h6>
        <div className="container">
          <div className="row">
            {/* Columna izquierda */}
            <div className="col-8" style={{ margin: 0 }}>
              <h4>Your Delivery Data</h4>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Fullname
                </span>
                <h4
                  className="form-control"
                  aria-label="Fullname"
                  aria-describedby="basic-addon1"
                >
                  {orderDetails.fullname}
                </h4>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Address
                </span>
                <h4
                  className="form-control"
                  aria-label="Address"
                  aria-describedby="basic-addon1"
                >
                  {orderDetails.address}
                </h4>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Contact
                </span>
                <h4
                  className="form-control"
                  aria-label="Phone"
                  aria-describedby="basic-addon1"
                >
                  {orderDetails.phone}
                </h4>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  City
                </span>
                <h4
                  className="form-control"
                  aria-label="City"
                  aria-describedby="basic-addon1"
                >
                  {orderDetails.city}
                </h4>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="col-4" style={{ margin: 0 }}>
              <div className="row g-5">
                <div className="col-md-12">
                  <h4 className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-primary">Your Order</span>
                    <span className="badge bg-primary rounded-pill">
                      {orderDetails.products.length}
                    </span>
                  </h4>
                  <ul className="list-group mb-3">
                    {orderDetails.products.map((device, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between lh-sm"
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={`${API_URL}/${device.image_url}`}
                            alt={device.name}
                            className="me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <h6 className="my-0">{device.name}</h6>
                            <small className="text-body-secondary">
                              {device.quantity} UDs
                            </small>
                          </div>
                        </div>
                        <span className="text-body-secondary">
                          ${device.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h4>Shipment: ${orderDetails.shipments}</h4>
          <h3>Total Amount: ${orderDetails.total}</h3>
          <Link to="/" className="nav-link px-2 text-white ms-3">
            <button className="btn btn-primary">Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
