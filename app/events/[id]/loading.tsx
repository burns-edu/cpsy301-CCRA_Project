export default function EventDetailLoading() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="h-[360px] animate-pulse bg-stone-900 sm:h-[420px]" />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="h-80 animate-pulse rounded-md bg-stone-200" />
        <div className="h-64 animate-pulse rounded-md bg-stone-200" />
      </section>
    </main>
  );
}
