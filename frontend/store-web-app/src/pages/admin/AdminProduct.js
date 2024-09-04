import React, { useEffect, useState} from "react";
import {  getproducts } from "../../apis/Products";


export default function AdminProduct() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const data = await getproducts();
            setProducts(data.products || []); // Ajusta según el nombre de propiedad
            setLoading(false);
          } catch (err) {
            setError(err.message);
            setLoading(false);
          }
        };
    
        fetchProducts();
      }, []);

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;

      if (products.length === 0) return <div>No products at moment!</div>;


  return (
    <div>
  <h1>All Products</h1>
  <div className="mt-5">
    <table className="table table-striped table-hover" style={{ borderCollapse: "separate", borderSpacing: "0 15px" }}>
      <thead className="text-center text-white" style={{ backgroundColor: "#343a40" }}>
        <tr>
          <th>ID</th>
          <th>Category</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Price</th>
          <th>IVA</th>
         
          <th>Ram</th>
          <th>Disk</th>
          <th>CPU</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index} className="text-center align-middle" style={{ borderTop: "3px solid #dee2e6" }}>
            <th scope="row" style={{ fontWeight: "bold", fontSize: "1.1em" }}>{product.product_id}</th>
            <td>{product.name}</td>
            <td>{product.category_id}</td>
            <td>{product.brand}</td>
            <td>${product.price}</td>
            <td>${product.iva}</td>
           
            <td>{product.ram_memory}MB</td>
            <td>{product.disk_memory}MB</td>
            <td>{product.cpu_speed}Hz</td>
            <td>{product.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  )
}
