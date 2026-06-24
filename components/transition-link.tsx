"use client";

import type { ComponentProps, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = ComponentProps<typeof Link>;

export default function TransitionLink({ href, onClick, children, ...props }: Props) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (onClick) (onClick as (e: MouseEvent<HTMLAnchorElement>) => void)(e);
    if (e.defaultPrevented) return;
    if (!href || typeof href !== "string") return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!document.startViewTransition) return;

    e.preventDefault();
    document.startViewTransition(() => router.push(href));
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
