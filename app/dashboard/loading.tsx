export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="h-20 border-b border-stone-200 bg-white" />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-48 animate-pulse rounded-md bg-stone-900" />
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="h-36 animate-pulse rounded-md bg-stone-200" />
          <div className="h-36 animate-pulse rounded-md bg-stone-200" />
          <div className="h-36 animate-pulse rounded-md bg-stone-200" />
        </div>
      </section>
    </main>
  );
}
