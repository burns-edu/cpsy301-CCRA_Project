"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { type CartItem, readCart, writeCart } from "@/components/product-catalog";
import { formatCurrency } from "@/lib/utils";

export default function CartView() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkedOut, setCheckedOut] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setItems(readCart());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const updateCart = (nextItems: CartItem[]) => {
    setItems(nextItems);
    writeCart(nextItems);
  };

  const updateQuantity = (id: string, delta: number) => {
    const nextItems = items
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      )
      .filter((item) => item.quantity > 0);

    updateCart(nextItems);
  };

  const removeItem = (id: string) => {
    updateCart(items.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    updateCart([]);
    setCheckedOut(true);
  };

  if (checkedOut) {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-6 text-center sm:p-8">
        <ShoppingBag className="mx-auto h-10 w-10 text-green-700" />
        <h2 className="mt-4 text-2xl font-semibold text-stone-950">Order placed</h2>
        <p className="mt-2 text-stone-700">
          Your prototype order was submitted. A production version would connect this to payment and fulfillment.
        </p>
        <Link
          href="/orders"
          className="mt-6 inline-flex rounded-md bg-stone-950 px-5 py-3 text-sm font-semibold text-white"
        >
          View orders
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-stone-300 bg-white p-6 text-center sm:p-10">
        <ShoppingBag className="mx-auto h-10 w-10 text-orange-600" />
        <h2 className="mt-4 text-2xl font-semibold text-stone-950">Your cart is empty</h2>
        <p className="mt-2 text-stone-600">Add apparel or member resources from the product page.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="grid grid-cols-[92px_minmax(0,1fr)] gap-4 rounded-md border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_minmax(0,1fr)_auto]">
            <div className="relative aspect-square overflow-hidden rounded-md bg-stone-200">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 120px, 92px"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
                {item.category}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-stone-950">{item.name}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
              <p className="mt-3 font-semibold text-stone-950">{formatCurrency(item.price)}</p>
            </div>
            <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
              <div className="flex items-center rounded-md border border-stone-200">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, -1)}
                  className="flex h-10 w-10 items-center justify-center text-stone-700 hover:bg-stone-100"
                  aria-label={`Decrease ${item.name}`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, 1)}
                  className="flex h-10 w-10 items-center justify-center text-stone-700 hover:bg-stone-100"
                  aria-label={`Increase ${item.name}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-md border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-stone-950">Order summary</h2>
        <div className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-600">Subtotal</span>
            <span className="font-medium text-stone-950">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-600">Estimated GST</span>
            <span className="font-medium text-stone-950">{formatCurrency(tax)}</span>
          </div>
          <div className="border-t border-stone-200 pt-3">
            <div className="flex justify-between text-base">
              <span className="font-semibold text-stone-950">Total</span>
              <span className="font-semibold text-stone-950">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCheckout}
          className="mt-6 w-full rounded-md bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Prototype checkout
        </button>
      </aside>
    </div>
  );
}
