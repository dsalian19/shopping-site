import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const CartModal = ({ onClose }) => {
  const { cart, clearCart, cartCount } = useContext(CartContext);
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      onClose();
      return;
    }

    // Create an object to tally quantities by product ID
    const quantities = cart.reduce((acc, item) => {
      acc[item.id] = (acc[item.id] || 0) + 1;
      return acc;
    }, {});

    // Create an array of products with the correct quantities for the API call
    const itemsToPurchase = Object.keys(quantities).map((id) => ({
      id: parseInt(id),
      quantity: quantities[id],
    }));

    try {
      const response = await fetch("http://localhost:8080/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemsToPurchase),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Order placed successfully!");
        clearCart();
        onClose();
      } else {
        alert(
          `Failed to place order: ${data.errors
            .map((err) => err.error)
            .join(", ")}`
        );
        clearCart();
        onClose();
      }
    } catch (error) {
      alert("Failed to place order. Please try again.");
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-lg p-5 w-full max-w-lg text-black"
        style={{ minHeight: "600px" }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1"></div>
          <h1 className="text-2xl font-semibold text-center flex-1">
            Your Cart
          </h1>
          <button onClick={onClose} className="text-xl flex-1 text-right">
            X
          </button>
        </div>
        {cart.length > 0 ? (
          <ul
            className="overflow-y-auto mb-4"
            style={{ maxHeight: "420px", minHeight: "420px" }}
          >
            {cart.map((item, index) => (
              <li key={index} className="flex mb-2 p-2 border-b">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-1/3 h-24 object-cover mr-4"
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-semibold">{item.name}</span>
                  <span className="font-semibold">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="text-center flex items-center justify-center"
            style={{ maxHeight: "420px", minHeight: "420px" }}
          >
            <p>Your cart is empty.</p>
          </div>
        )}
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Total Items: {cartCount}</h3>
          <h3 className="text-xl font-semibold">Total Price: ${totalPrice}</h3>
        </div>
        <button
          onClick={handleCheckout}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-4 rounded w-full"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartModal;
