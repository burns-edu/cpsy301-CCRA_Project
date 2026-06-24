export default function Loading() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="sticky top-0 h-16 border-b border-stone-200 bg-white" />
      <div className="h-[320px] animate-pulse bg-stone-900 sm:h-[360px]" />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="h-64 animate-pulse rounded-md bg-stone-200" />
        <div className="h-64 animate-pulse rounded-md bg-stone-200" />
        <div className="h-64 animate-pulse rounded-md bg-stone-200" />
      </section>
    </main>
  );
}
