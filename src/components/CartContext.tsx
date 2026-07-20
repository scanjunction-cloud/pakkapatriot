/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CartContext — manages the shopping cart globally.
 * Uses local state + localStorage persistence.
 * Order creation is handled during checkout via REST API.
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react";
import { WCProduct, CartItem } from "../types";

/* ─── State Shape ──────────────────────────────────────────────────────── */

interface CartState {
  items: CartItem[];
  /** Whether the cart drawer is open */
  open: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: WCProduct; quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_OPEN"; payload: boolean };

/* ─── Reducer ──────────────────────────────────────────────────────────── */

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product, quantity }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.payload.productId),
      };

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.product.id !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "SET_OPEN":
      return { ...state, open: action.payload };

    default:
      return state;
  }
}

/* ─── Context ──────────────────────────────────────────────────────────── */

interface CartContextValue {
  state: CartState;
  addItem: (product: WCProduct, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

/* ─── Provider ─────────────────────────────────────────────────────────── */

const STORAGE_KEY = "pakka_cart_items";

function loadPersistedItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function persistItems(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: loadPersistedItems(),
    open: false,
  });

  // Persist to localStorage on change
  useEffect(() => {
    persistItems(state.items);
  }, [state.items]);

  const addItem = useCallback((product: WCProduct, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  }, []);

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const setOpen = useCallback((open: boolean) => {
    dispatch({ type: "SET_OPEN", payload: open });
  }, []);

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (acc, i) => acc + parseFloat(i.product.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setOpen,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ─── Hook ─────────────────────────────────────────────────────────────── */

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
