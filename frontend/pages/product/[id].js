import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { useCart } from "../../contexts/CartContext";

function ProductDetail() {
  const [product, setProduct] = useState({});
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/products/${id}`)
        .then((response) => response.json())
        .then((data) => setProduct(data))
        .catch((error) =>
          console.error("Error fetching product detail:", error)
        );
    }
  }, [id]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setMessage(`Added ${product.name} to cart!`);
    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <div className="fixed top-12 left-0 w-full flex justify-center z-50">
        {message && (
          <div className="bg-green-500 text-white p-4 rounded-md shadow-lg mt-4">
            {message}
          </div>
        )}
      </div>
      <div
        className="flex items-center justify-center min-h-screen overflow-hidden"
        style={{ transform: "translateY(-10%)" }}
      >
        <div className="flex flex-row w-full max-w-4xl scale-150 origin-top">
          <div className="flex flex-col w-1/2 p-4 border-r border-gray-300 justify-between">
            <img
              src={product.image_url}
              alt={product.name}
              className="mx-auto object-cover rounded-lg"
              style={{ maxHeight: "450px" }}
            />
          </div>
          <div className="flex flex-col w-1/2 p-4 justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {product.name} - ${product.price}
              </h1>
              <p className="mb-2">{product.description}</p>
              <p className="mb-2 text-sm text-gray-600">
                {product.quantity} left in stock
              </p>
            </div>
            <div className="flex flex-col space-y-4 mt-4">
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded w-full"
              >
                Add to Cart
              </button>
              <Link href="/">
                <div className="bg-gray-200 hover:bg-gray-400 text-black font-bold py-2 rounded text-center cursor-pointer w-full">
                  Back to Home
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
