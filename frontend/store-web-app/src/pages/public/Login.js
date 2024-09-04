import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../apis/Auth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log(username, password)

    try {
      const response = await loginUser( username, password );
      login(response); // Actualiza el contexto con los datos del usuario
      setSuccess(response.new_user); // Mensaje de éxito recibido
      toast.success(response.new_user); // Mostrar alerta de éxito
      setTimeout(() => {
        navigate("/"); // Redirigir a la página principal
      }, 1000); //
    } catch (error) {
      setError("Error login user: " + error.message);
      toast.error("Error login user: " + error.message); // Mostrar alerta de error
    }
  };

  return (
    <div class="my-5 mx-5">
      <form onSubmit={handleSubmit}>

        <h1 class="h3 mb-5 fw-normal">Please sign in</h1>

        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label for="floatingInput">Username</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label for="floatingPassword">Password</label>
        </div>


        <button class="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>
      </form>
      {success && <div className="alert alert-success mt-3">{success}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
