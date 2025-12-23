import React from "react";
import { ProductUserGuideSection } from "./ProductUserGuideSection";
import { ProductSessionFeaturesSection } from "./ProductSessionFeaturesSection";

export default function ProductPage() {
  return (
    <main className="w-full bg-white">
      <ProductUserGuideSection />
      <ProductSessionFeaturesSection />
    </main>
  );
}
