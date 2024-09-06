import React, { useEffect, useState, useRef } from "react";
import {
  createProductItem,
  createCategory,
  uploadImages,
} from "../../apis/Admin";
import { toast } from "react-toastify";
import { getCategories, getproducts } from "../../apis/Products";

export default function CreateProduct() {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [ramMemory, setRamMemory] = useState(0);
  const [cpu, setCpu] = useState(0);
  const [diskMemory, setDiskMemory] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const mainImageRef = useRef(null);
  const secondImageRef = useRef(null);
  const thirdImageRef = useRef(null);
  const fourthImageRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await createCategory(category);
      setSuccess(response.category_created); // Mensaje de éxito recibido
      toast.success("category added:", response.category_created); // Mostrar alerta de éxito
      setCategory("");
      setTimeout(() => {}, 1000);
    } catch (error) {
      setError("Error registering user: " + error.message);
      toast.error("Error registering user: " + error.message); // Mostrar alerta de error
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await createProductItem({
        name,
        brand,
        price: Number(price),
        description,
        ram_memory: Number(ramMemory),
        cpu_speed: Number(cpu),
        disk_memory: Number(diskMemory),
        stock: Number(stock),
        category_id: Number(categoryId),
      });
      setSuccess(response.order_id); // Mensaje de éxito recibido
      toast.success("Order generated: " + response.order_id);
      // Limpiar el formulario restableciendo los valores de los estados
      setName("");
      setBrand("");
      setPrice(0);
      setDescription("");
      setRamMemory(0);
      setCpu(0);
      setDiskMemory(0);
      setStock(0);
      setCategoryId(0);
    } catch (error) {
      setError("Error registering product: " + error.message);
      toast.error("Error registering product: " + error.message); // Mostrar alerta de error
    }
  };
  const handleImageSubmit = async (e) => {
    e.preventDefault();

    const images = {
      mainImage: mainImageRef.current.files[0],
      secondImage: secondImageRef.current.files[0],
      thirdImage: thirdImageRef.current.files[0],
      fourthImage: fourthImageRef.current.files[0],
    };

    try {
      const response = await uploadImages(productId, images);
      console.log("Images uploaded successfully:", response);
      toast.success("Images uploaded successfully");
      mainImageRef.current.value = "";
      secondImageRef.current.value = "";
      thirdImageRef.current.value = "";
      fourthImageRef.current.value = "";
    } catch (error) {
      console.error("Failed to upload images:", error);
      toast.error("Failed to upload images");
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
        setCategories(data.categories || []); // Ajusta según el nombre de propiedad
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
        setProducts(data.products || []); // Ajusta según el nombre de propiedad
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to fetch categories. Please try again.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Create Product</h1>

      <h3>Add Category</h3>
      <div className="mb-4 border-bottom">
        <form onSubmit={handleCategorySubmit}>
          <div className="col-12 mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              type="text"
              className="form-control"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <div className="invalid-feedback">Please enter your category.</div>
          </div>
          <button className="btn btn-primary mt-3 d-block mx-auto">
            Add Category
          </button>
        </form>
      </div>

      <h3>Add Product</h3>
      <div className="mb-4 border-bottom">
        <form onSubmit={handleProductSubmit}>
          <div className="col-12 mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              Please enter your product name.
            </div>
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="brand" className="form-label">
              Brand
            </label>
            <input
              type="text"
              className="form-control"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              Please enter your product brand.
            </div>
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              Please enter your product price.
            </div>
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              placeholder="Brief Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              Please enter your product description.
            </div>
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="ramMemory" className="form-label">
              Ram Memory (GB)
            </label>
            <input
              type="number"
              className="form-control"
              id="ramMemory"
              min="0"
              value={ramMemory}
              onChange={(e) => setRamMemory(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              Please enter your product RAM.
            </div>
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="cpu" className="form-label">
              CPU (GHz)
            </label>
            <input
              type="number"
              className="form-control"
              id="cpu"
              min="0"
              value={cpu}
              onChange={(e) => setCpu(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              Please enter your product CPU.
            </div>
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="diskMemory" className="form-label">
              Disk Memory (GB)
            </label>
            <input
              type="number"
              className="form-control"
              id="diskMemory"
              min="0"
              value={diskMemory}
              onChange={(e) => setDiskMemory(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              Please enter your product disk memory.
            </div>
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="stock" className="form-label">
              Stock
            </label>
            <input
              type="number"
              className="form-control"
              id="stock"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              Please enter your product stock.
            </div>
          </div>

          <div className="col-md-5 mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
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
            <div className="invalid-feedback">
              Please select a valid category.
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-3 d-block mx-auto"
          >
            Add Product
          </button>
        </form>
      </div>

      <h3>Add Images</h3>
      <div className="mb-4">
        <form onSubmit={handleImageSubmit}>
          <div className="col-md-5 mb-3">
            <label htmlFor="product" className="form-label">
              Product
            </label>
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
            <div className="invalid-feedback">
              Please select a valid Product.
            </div>
          </div>

          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="mainImage">
              Main Image
            </label>
            <input
              type="file"
              className="form-control"
              id="mainImage"
              accept="image/*"
              ref={mainImageRef}
            />
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="secondImage">
              Second Image
            </label>
            <input
              type="file"
              className="form-control"
              id="secondImage"
              accept="image/*"
              ref={secondImageRef}
            />
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="thirdImage">
              Third Image
            </label>
            <input
              type="file"
              className="form-control"
              id="thirdImage"
              accept="image/*"
              ref={thirdImageRef}
            />
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="fourthImage">
              Fourth Image
            </label>
            <input
              type="file"
              className="form-control"
              id="fourthImage"
              accept="image/*"
              ref={fourthImageRef}
            />
          </div>

          <button className="btn btn-primary mt-3 d-block mx-auto">
            Add Images
          </button>
        </form>
      </div>
    </div>
  );
}
