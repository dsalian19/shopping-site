import React, { createContext, useContext, useState } from "react";

export const CartContext = createContext({
  cart: [],
  setCart: () => {},
  addToCart: () => {},
  clearCart: () => {},
  cartCount: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    setCart((currentCart) => [...currentCart, product]);
  };
  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
