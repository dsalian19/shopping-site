import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useCart } from "../contexts/CartContext";

function Index() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setMessage(`Added ${product.name} to cart!`);
    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="fixed top-12 left-0 w-full flex justify-center z-50">
        {message && (
          <div className="bg-green-500 text-white p-4 rounded-md shadow-lg mt-4">
            {message}
          </div>
        )}
      </div>
      <div className="container mx-auto p-4 pt-20">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl p-4 relative"
            >
              <Link href={`/product/${product.id}`}>
                <div className="cursor-pointer w-full">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-72 object-cover rounded mb-2"
                  />
                  <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                  <p className="text-gray-800 mb-4">${product.price}</p>
                </div>
              </Link>
              <div className="flex justify-end absolute bottom-8 right-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Index;
