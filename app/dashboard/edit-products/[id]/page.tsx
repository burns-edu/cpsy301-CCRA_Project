"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { getErrorMessage } from "@/lib/utils";
import { useAdminAccess } from "@/lib/use-admin-access";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { checkingAccess } = useAdminAccess();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const id = params.id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [description, setDescription] = useState("");
  const [currentImage, setCurrentImage] = useState("/hero-rodeo.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (checkingAccess || !id) return;

    void (async () => {
      try {
        const snap = await getDoc(doc(db, "products", id));
        if (!snap.exists()) {
          router.push("/dashboard/products");
          return;
        }
        const d = snap.data();
        setName(d.name || "");
        setPrice(String(d.price ?? ""));
        setCategory(d.category || "Apparel");
        setDescription(d.description || "");
        setCurrentImage(d.image || "/hero-rodeo.png");
      } finally {
        setFetching(false);
      }
    })();
  }, [checkingAccess, id, router]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setMessage("Please enter a valid price.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let imageUrl = currentImage;

      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name.replaceAll(" ", "-")}`;
        const storageRef = ref(storage, `products/${fileName}`);
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "products", id), {
        name: name.trim(),
        price: parsedPrice,
        category,
        description: description.trim(),
        image: imageUrl,
      });

      setMessage("Product updated.");
      window.setTimeout(() => router.push("/dashboard/products"), 800);
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, "Failed to update product."));
    } finally {
      setLoading(false);
    }
  };

  if (checkingAccess || fetching) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <p className="text-stone-600">Loading...</p>
      </main>
    );
  }

  const displayImage = previewUrl || currentImage;

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <Link href="/dashboard/products" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100">
            <ArrowLeft className="h-4 w-4" />
            Products
          </Link>
          <h1 className="order-3 w-full text-center text-xl font-semibold text-stone-950 sm:order-none sm:w-auto sm:text-2xl">
            Edit Product
          </h1>
          <div className="hidden w-24 sm:block" />
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <form onSubmit={handleSubmit} className="rounded-md border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-stone-950">Product details</h2>
          <div className="mt-6 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-700">Product name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Price (CAD)</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0.01"
                  step="0.01"
                  className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-12 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-orange-500"
                >
                  <option>Apparel</option>
                  <option>Accessories</option>
                  <option>Resources</option>
                  <option>Equipment</option>
                </select>
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-700">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
                className="rounded-md border border-stone-300 px-3 py-3 outline-none transition focus:border-orange-500"
              />
            </label>
          </div>

          {message && (
            <p className="mt-5 rounded-md bg-orange-50 px-4 py-3 text-sm text-orange-800">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>

        <aside className="h-fit rounded-md border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-950">Product image</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Upload a new image to replace the current one.
          </p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative mt-5 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-orange-300 bg-orange-50 text-center"
          >
            {displayImage && displayImage !== "/hero-rodeo.png" ? (
              <Image
                src={displayImage}
                alt="Product image"
                fill
                className="object-cover"
                unoptimized={displayImage.startsWith("blob:") || displayImage.startsWith("http")}
              />
            ) : (
              <span className="grid justify-items-center gap-3 px-6 text-sm font-semibold text-orange-800">
                <ImagePlus className="h-8 w-8" />
                Replace image
              </span>
            )}
          </button>
          {selectedFile && (
            <p className="mt-3 text-xs text-stone-500">New image selected: {selectedFile.name}</p>
          )}
        </aside>
      </section>
    </main>
  );
}
