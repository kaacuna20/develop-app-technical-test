import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../apis/Auth";
import { toast } from "react-toastify";

export default function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
  
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      
      try {
        const response = await registerUser({ email, username, password });
        setSuccess(response.new_user); // Mensaje de éxito recibido
        toast.success(response.new_user); // Mostrar alerta de éxito
        setTimeout(() => {
          navigate("/login"); // Redirigir a la página de inicio de sesión
        }, 2000); // Redirigir después de 2 segundos para que el usuario vea la alerta
      } catch (error) {
        setError("Error registering user: " + error.message);
        toast.error("Error registering user: " + error.message); // Mostrar alerta de error
      }
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
  
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        
        {/* Mostrar mensajes de éxito o error */}
        {success && <div className="alert alert-success mt-3">{success}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    );
  }