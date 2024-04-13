import React, { useState } from "react";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import CartModal from "./CartModal";

const Navbar = () => {
  const { cartCount } = useCart();
  const [isCartOpen, setCartOpen] = useState(false); // State to manage modal visibility

  const toggleCartModal = () => {
    setCartOpen(!isCartOpen); // Toggle the state to show or hide the modal
  };

  return (
    <nav className="bg-gray-800 text-white p-4 fixed w-full z-50 top-0">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1"></div>
        <h1 className="text-xl font-semibold text-center flex-1">
          <Link href="/" className="cursor-pointer text-center block w-full">
            Shopping Site
          </Link>
        </h1>
        <div className="flex flex-1 justify-end items-center">
          <button
            onClick={toggleCartModal}
            className="flex items-center cursor-pointer"
          >
            <FiShoppingCart className="text-2xl mr-2" />
            <span>({cartCount})</span>
          </button>
        </div>
      </div>
      {isCartOpen && <CartModal onClose={() => setCartOpen(false)} />}
    </nav>
  );
};

export default Navbar;
