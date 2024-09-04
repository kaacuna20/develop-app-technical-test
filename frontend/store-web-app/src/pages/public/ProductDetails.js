import React, { useState, useEffect } from "react";
import { getProduct } from "../../apis/Products";
import { useParams} from "react-router-dom";
import { toast } from "react-toastify";
import { addProductCart } from "../../apis/Cart";
import './../../css/ProductDetailStyle.css'; 


export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const [images, setImages] = useState({});
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (images && images.main_image_url) {
      setMainImage(images.main_image_url); // Initialize mainImage with the main image URL
    }
  }, [images]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const data = await getProduct(slug);
        setProduct(data.response.product);
        setImages(data.response.images)
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        //toast.error("Error loading products: " + err.message);
      }
    };

    fetchProductDetail();
  }, [slug]);

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + change;
      return newQuantity > 0 ? newQuantity : 1; // Ensure quantity is at least 1
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await addProductCart({ product_id: product.product_id, quantity });
      toast.success("Product added to cart successfully!");
    } catch (err) {
      toast.error(err.message || "An error occurred while adding the item to the cart.");
    }
  };

    // Filter out non-image entries
  const imageUrls = Object.entries(images)
    .filter(([key]) => key.includes('image_url')) // Filter only keys that include 'image_url'
    .map(([_, value]) => value); // Extract values

  if (loading) return <p>Loading...</p>;
  if (error) return <h1>Error: {error}</h1>;
  return (
    <div className="product-detail mt-5">
      <div className="row">
        {/* Left Column: Images */}
        <div className="col-md-6">
          <div className="main-image">
            <img
              src={`http://localhost:8000/${mainImage}`}
              alt="Main Product"
              className="img-fluid"
            />
          </div>
          <div className="small-images mt-3">
            <div className="row">
              {imageUrls.map((image, idx) => (
                <div className="col-3" key={idx}>
                  <img
                    src={`http://localhost:8000/${image}`}
                    alt={`Thumbnail ${idx}`}
                    className="img-thumbnail"
                    onClick={() => setMainImage(image)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Right Column: Product Details and Add to Cart */}
        <div
          className="col-md-6 d-flex flex-column justify-content-center align-items-center"
        >
          <h1 className="text-center">{product.name}</h1>
          <h2 className="text-center">{product.brand}</h2>
          <h3 className="text-center">${product.price}</h3>
          <ul className="text-center list-unstyled">
            <li>{product.description}</li>
            <li>{product.ram_memory} GB RAM</li>
            <li>{product.disk_memory} GB Disk</li>
            <li>{product.cpu_speed} GHz CPU</li>
          </ul>
          <form onSubmit={handleSubmit} className="w-100 text-center">
            <input type="hidden" name="product_id" value={product.product_id} />
            <div className="py-2 d-flex justify-content-center align-items-center">
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <div className="quantity-input mx-2">
                {quantity}
              </div>
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
}

