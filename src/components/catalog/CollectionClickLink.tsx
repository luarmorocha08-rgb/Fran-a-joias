"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

export function CollectionClickLink({ href, collection, className, children }: { href: string; collection: string; className?: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={className} onClick={() => track("collection_click", { collection, source: "collection_page" })}>
      {children}
    </Link>
  );
}
