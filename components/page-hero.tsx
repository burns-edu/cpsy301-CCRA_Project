import Image from "next/image";
import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  image?: string;
  children?: ReactNode;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  image = "/hero-rodeo.webp",
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-stone-950 text-white">
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover opacity-55"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/20" />
      <div className="relative mx-auto flex min-h-[320px] w-full max-w-7xl flex-col justify-end px-4 py-10 sm:min-h-[360px] sm:px-6 sm:py-12 lg:px-8">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200 sm:text-sm sm:tracking-[0.22em]">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-100 sm:text-lg">
          {description}
        </p>
        {children && (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap [&>*]:w-full [&>*]:justify-center sm:[&>*]:w-auto">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
