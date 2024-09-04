import React, { useEffect, useState } from "react";
import { updateCategory, updateProduct, deleteCategory } from "../../apis/Admin";
import { toast } from "react-toastify";
import { getCategories, getproducts } from "../../apis/Products";

export default function AdminAlterProduct() {
  const [newCategory, setNewCategory] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await updateCategory(categoryId, newCategory);
      setSuccess(response.response);
      toast.success("Category updated: " + response.response);
      setNewCategory("");
      setTimeout(() => {}, 1000);
    } catch (error) {
      setError("Error updating category: " + error.message);
      toast.error("Error updating category: " + error.message);
    }
  };
  const handleDeleteCategorySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await deleteCategory(categoryId);
      setSuccess(response.response);
      toast.success("Category delete: " + response.response);
      setNewCategory("");
      setTimeout(() => {}, 1000);
    } catch (error) {
      setError("Error updating category: " + error.message);
      toast.error("Error updating category: " + error.message);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await updateProduct(productId, {
        price: Number(price),
        stock: Number(stock),
        category_id: Number(categoryId),
      });
      setSuccess(response.response);
      toast.success("Product updated: " + response.response);
      setPrice(0);
      setStock(0);
  
    } catch (error) {
      setError("Error updating product: " + error.message);
      toast.error("Error updating product: " + error.message);
    }
  };

  const handleCategoryChange = (event) => {
    setCategoryId(parseInt(event.target.value)); // Convertir el valor a número
  };

  const handleProductChange = (event) => {
    setProductId(parseInt(event.target.value)); // Convertir el valor a número
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getproducts();
        setProducts(data.products || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to fetch products. Please try again.");
      }
    };

    fetchProducts();
  }, []);

  console.log(productId);
  console.log(categoryId);
  console.log(products)

  return (
    <div className="container my-5">
  <h1 className="text-center">Modify Products</h1>
  
  <div className="my-4">
    <h3>Change Category</h3>
    <form onSubmit={handleCategorySubmit} className="form-container">
      <div className="mb-3">
        <label htmlFor="category" className="form-label">Category to Update</label>
        <select
          className="form-select"
          id="category-select"
          required
          value={categoryId}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="new-category" className="form-label">New Category</label>
        <input
          type="text"
          className="form-control"
          id="new-category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
        <div className="invalid-feedback">Please enter a new category.</div>
      </div>
      <button type="submit" className="btn btn-primary">Change Category</button>
    </form>
  </div>

  <hr className="my-4" />

  <div className="my-4">
    <h3>Alter Product</h3>
    <form onSubmit={handleProductSubmit} className="form-container">
      <div className="mb-3">
        <label htmlFor="product" className="form-label">Choose Product</label>
        <select
          className="form-select"
          id="product"
          required
          value={productId}
          onChange={handleProductChange}
        >
          {products.map((product) => (
            <option key={product.product_id} value={product.product_id}>
              {product.name}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">Please select a valid product.</div>
      </div>
      <div className="mb-3">
        <label htmlFor="price" className="form-label">Update Price</label>
        <input
          type="number"
          className="form-control"
          id="price"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <div className="invalid-feedback">Please enter a valid product price.</div>
      </div>
      <div className="mb-3">
        <label htmlFor="stock" className="form-label">Update Stock</label>
        <input
          type="number"
          className="form-control"
          id="stock"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <div className="invalid-feedback">Please enter valid product stock.</div>
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">Change Product Category</label>
        <select
          className="form-select"
          id="category"
          required
          value={categoryId}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">Please select a valid category.</div>
      </div>
      <button type="submit" className="btn btn-primary">Alter Product</button>
    </form>
  </div>

  <hr className="my-4" />

  <div className="my-4">
    <h3>Delete Category</h3>
    <form onSubmit={handleDeleteCategorySubmit} className="form-container">
      <div className="mb-3">
        <label htmlFor="category-select" className="form-label">Category</label>
        <select
          className="form-select"
          id="category-select"
          required
          value={categoryId}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Delete Category</button>
    </form>
  </div>
</div>

  );
}
