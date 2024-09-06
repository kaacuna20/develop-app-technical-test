import React, { useEffect, useState } from "react";
import { getUsers, updateUserState, getOrders } from "../../apis/Admin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify

export default function AdminPannel() {
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setAllUsers(data.users_registered);
      } catch (err) {
        setError(err);
      }
    };

    fetchUsers();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (allUsers.length === 0)
    return <div>No users registered at the moment!</div>;

  const handleCheckboxChange = async (userId, isChecked) => {
    try {
      await updateUserState(userId, isChecked);
      // Optionally, update local state to reflect changes immediately
      setAllUsers(
        allUsers.map((user) =>
          user.user_id === userId ? { ...user, is_active: isChecked } : user
        )
      );
    } catch (err) {
      // Optionally, handle errors here or show additional feedback
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col" style={{ margin: "0 auto", maxWidth: "1200px" }}>
            <h2>Tabla de Usuarios</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Register Date</th>
                  <th scope="col">Is Active</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.user_id}>
                    <th scope="row">{user.user_id}</th>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.register_date}</td>
                    <td>
                      <div className="form-check text-start my-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={user.is_active}
                          onChange={(e) =>
                            handleCheckboxChange(user.user_id, e.target.checked)
                          }
                          id={`checkbox-${user.user_id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`checkbox-${user.user_id}`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
