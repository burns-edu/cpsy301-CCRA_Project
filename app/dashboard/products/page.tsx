"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/site-data";
import { useAdminAccess } from "@/lib/use-admin-access";
import { formatCurrency } from "@/lib/utils";

function normalizeProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: (data.name as string) || "Unnamed product",
    price: typeof data.price === "number" ? data.price : 0,
    category: (data.category as string) || "Apparel",
    image: (data.image as string) || "/hero-rodeo.png",
    description: (data.description as string) || "",
  };
}

function imageNeedsUnoptimized(src: string) {
  return src.startsWith("http") || src.startsWith("blob:");
}

export default function ManageProductsPage() {
  const { checkingAccess } = useAdminAccess();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map((d) => normalizeProduct(d.id, d.data() as Record<string, unknown>)));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (checkingAccess) return;
    void loadProducts();
  }, [checkingAccess, loadProducts]);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
    setConfirmDeleteId(null);
    await loadProducts();
  };

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <p className="text-stone-600">Checking access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="order-3 w-full text-center text-xl font-semibold text-stone-950 sm:order-none sm:w-auto sm:text-2xl">
            Manage Products
          </h1>
          <Link
            href="/dashboard/create-product"
            className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-md border border-stone-200 bg-white p-8 text-stone-600 shadow-sm">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-md border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-stone-950">No products yet</h2>
            <p className="mt-2 text-stone-600">Add the first product to the member shop.</p>
            <Link
              href="/dashboard/create-product"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add product
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => {
              const image = product.image || "/hero-rodeo.png";
              return (
                <article key={product.id} className="grid gap-4 rounded-md border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-center">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-stone-200">
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="140px"
                      unoptimized={imageNeedsUnoptimized(image)}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">{product.category}</p>
                    <h2 className="mt-1 text-xl font-semibold text-stone-950">{product.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-orange-700">{formatCurrency(product.price)}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-stone-600">{product.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:flex md:justify-end">
                    <Link
                      href={`/dashboard/edit-products/${product.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(product.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-stone-950">Delete product?</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              This removes the product from Firestore and the member shop.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
