"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ArrowLeft, ImagePlus, Package, Save } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { getErrorMessage } from "@/lib/utils";
import { useAdminAccess } from "@/lib/use-admin-access";

export default function CreateProductPage() {
  const { user, checkingAccess } = useAdminAccess();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    if (!user || loading) return;

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setMessage("Please enter a valid price.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let imageUrl = "/hero-rodeo.png";

      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name.replaceAll(" ", "-")}`;
        const storageRef = ref(storage, `products/${fileName}`);
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "products"), {
        name: name.trim(),
        price: parsedPrice,
        category,
        description: description.trim(),
        image: imageUrl,
        createdAt: serverTimestamp(),
        createdBy: user.email || "",
      });

      setMessage("Product added successfully.");
      window.setTimeout(() => router.push("/dashboard/products"), 800);
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, "Failed to add product."));
    } finally {
      setLoading(false);
    }
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
            Add Product
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
                placeholder="e.g. CCRA Cap"
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
                  placeholder="0.00"
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
                placeholder="Describe the product for members..."
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
            {loading ? "Adding..." : "Add product"}
          </button>
        </form>

        <aside className="h-fit rounded-md border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-950">Product image</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Optional. A default placeholder is used if no image is uploaded.
          </p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative mt-5 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-orange-300 bg-orange-50 text-center"
          >
            {previewUrl ? (
              <Image src={previewUrl} alt="Product preview" fill className="object-cover" unoptimized />
            ) : (
              <span className="grid justify-items-center gap-3 px-6 text-sm font-semibold text-orange-800">
                <ImagePlus className="h-8 w-8" />
                Choose product photo
              </span>
            )}
          </button>
          <div className="mt-5 rounded-md border border-stone-200 bg-stone-50 p-4">
            <Package className="h-5 w-5 text-stone-400" />
            <p className="mt-2 text-xs leading-5 text-stone-500">
              Products added here appear live in the member shop. Prices are in CAD.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
