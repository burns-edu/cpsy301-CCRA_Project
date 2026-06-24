"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { db } from "@/lib/firebase";
import { products as staticProducts, type Product } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";

export type CartItem = Product & { quantity: number };

const CART_KEY = "ccra-cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) || "[]") as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addProductToCart(product: Product) {
  const cart = readCart();
  const existing = cart.find((item) => item.id === product.id);
  const nextCart = existing
    ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
    : [...cart, { ...product, quantity: 1 }];
  writeCart(nextCart);
  return nextCart;
}

function normalizeProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: (data.name as string) || "Product",
    price: typeof data.price === "number" ? data.price : 0,
    category: (data.category as string) || "Apparel",
    image: (data.image as string) || "/hero-rodeo.png",
    description: (data.description as string) || "",
  };
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [addedProduct, setAddedProduct] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const liveProducts = snapshot.docs.map((d) =>
          normalizeProduct(d.id, d.data() as Record<string, unknown>),
        );
        if (active && liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      } catch {
        // keep static fallback
      }
    })();

    return () => { active = false; };
  }, []);

  const handleAdd = (product: Product) => {
    addProductToCart(product);
    setAddedProduct(product.id);
    window.setTimeout(() => setAddedProduct(null), 1600);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950">Member shop</h2>
          <p className="mt-1 text-sm text-stone-600">Apparel, accessories, and resources for CCRA members.</p>
        </div>
        <Link
          href="/cart"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 sm:w-auto"
        >
          <ShoppingCart className="h-4 w-4" />
          View cart
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article key={product.id} className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3] bg-stone-200">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                unoptimized={product.image.startsWith("http") || product.image.startsWith("blob:")}
              />
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                    {product.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-stone-950">{product.name}</h3>
                </div>
                <p className="w-fit rounded-md bg-stone-100 px-2.5 py-1 text-sm font-semibold text-stone-950">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <p className="mt-3 min-h-[48px] text-sm leading-6 text-stone-600">{product.description}</p>
              <button
                type="button"
                onClick={() => handleAdd(product)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                {addedProduct === product.id ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to cart
                  </>
                )}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export { CART_KEY, readCart, writeCart };
