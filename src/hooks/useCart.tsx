import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { CartItem, Product } from '../types';

// 1. Definimos la "forma" (interfaz) de nuestro contexto del carrito
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// 2. Creamos el Contexto, especificando su tipo correctamente.
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Creamos un componente "Proveedor" que gestionará el estado del carrito
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cargar el carrito desde localStorage solo una vez, cuando el componente se monta
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('rosario-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage:", error);
      setCartItems([]);
    }
  }, []);

  // Guardar el carrito en localStorage cada vez que el estado 'cartItems' cambie
  useEffect(() => {
    localStorage.setItem('rosario-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id && item.size === size);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, size, quantity }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCartItems(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
        {children}
    </CartContext.Provider>
  );
};

// 4. Creamos el hook `useCart` que los componentes usarán para acceder al carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};