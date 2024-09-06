import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCheckOut, createOrder } from "../../apis/Order";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Base URL of your FastAPI backend
const API_URL = "http://localhost:8000";

export default function CheckOut() {
  const [checkOut, setCheckOut] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [shipments, setShipments] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await createOrder({
        fullname: fullName,
        phone: phone,
        address: address,
        city: city,
        zip_code: zipCode,
        shipments: Number(shipments),
      });
      setSuccess(response.order_id); // Mensaje de éxito recibido
      toast.success("order generated:", response.order_id); // Mostrar alerta de éxito
      setTimeout(() => {
        navigate(`/order/${response.order_id}`); // Redirigir a la página de order details
      }, 1000); // Redirigir después de 2 segundos para que el usuario vea la alerta
    } catch (error) {
      setError("Error creating order: " + error.message);
      toast.error("Error creating order: " + error.message); // Mostrar alerta de error
    }
  };
  const handleShipmentChange = (event) => {
    setShipments(parseInt(event.target.value)); // Convertir el valor a número
  };

  useEffect(() => {
    const fetchCheckOut = async () => {
      try {
        const data = await getCheckOut();
        setCheckOut(data.response);
      } catch (err) {
        setError(err);
      }
    };

    fetchCheckOut();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!checkOut) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        {/* Formulario en el lado izquierdo */}
        <div className="col-md-7" style={{ marginLeft: 0, marginRight: 0 }}>
          <h4 className="mb-3">Billing address</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6">
                <label htmlFor="firstName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <div className="invalid-feedback">
                  Valid fullname is required.
                </div>
              </div>

              <div className="col-sm-6">
                <label htmlFor="lastName" className="form-label">
                  Contact
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  pattern="\d{10}"
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-12">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <div className="invalid-feedback">
                  Please enter a valid city.
                </div>
              </div>

              <div className="col-12">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="1234 Main St"
                  value={address}
                  onChange={(e) => setAdress(e.target.value)}
                  required
                />
                <div className="invalid-feedback">
                  Please enter your shipping address.
                </div>
              </div>

              <div className="col-md-3">
                <label htmlFor="zip" className="form-label">
                  Zip
                </label>
                <span className="text-body-secondary">(Optional)</span>
                <input
                  type="text"
                  className="form-control"
                  id="zip"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>

              <div className="col-md-5">
                <label htmlFor="country" className="form-label">
                  Shipments
                </label>
                <select
                  className="form-select"
                  id="shipment"
                  required
                  value={shipments}
                  onChange={handleShipmentChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
                <div className="invalid-feedback">
                  Please select a valid Shipment.
                </div>
              </div>
            </div>

            <button className="w-100 btn btn-primary btn-lg mt-3" type="submit">
              Create Order
            </button>
          </form>
        </div>

        {/* Lista de productos en el lado derecho */}
        <div className="col-md-5" style={{ marginLeft: 0, marginRight: 0 }}>
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-primary">Your cart</span>
            <span className="badge bg-primary rounded-pill">
              {checkOut.total_devices}
            </span>
          </h4>
          <ul className="list-group mb-3">
            {checkOut.devices.map((device, index) => (
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
                <span className="text-body-secondary">${device.price}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between">
              <span>SubTotal (USD)</span>
              <strong>${checkOut.total_price}</strong>
            </li>
          </ul>
        </div>
      </div>

      <Link
        to="/order/e88c8b5f-9158-4d6e-8c22-f4bf0df85348/"
        className="nav-link px-2 text-white ms-3"
      >
        Go to order
      </Link>
    </div>
  );
}
