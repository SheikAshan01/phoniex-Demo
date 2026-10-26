"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShopCatalog } from "./shop-catalog";

function ShopCatalogWithParams() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const q = searchParams.get("q") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const brand = searchParams.get("brand") || undefined;

  return (
    <ShopCatalog
      initialParams={{
        category,
        q,
        sort,
        brand,
      }}
    />
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopCatalog />}>
      <ShopCatalogWithParams />
    </Suspense>
  );
}
