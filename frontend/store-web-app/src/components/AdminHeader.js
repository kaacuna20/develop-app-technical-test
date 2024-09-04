import React, { useEffect, useState } from "react";
import { getOrders } from "../apis/Admin";
import {getproducts } from "../apis/Products";

export default function AdminHeader() {
  const [allOrders, setAllOrders] = useState([]);
  const [ordertId, setOrdertId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);



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


if (error) return <div>Error: {error}</div>;
if (allOrders.length === 0) return <div>No users registered at the moment!</div>;

  return (
    <div>
    
      <header class="py-3 mb-3 border-bottom ">
      
      </header>
    </div>
  )
}
