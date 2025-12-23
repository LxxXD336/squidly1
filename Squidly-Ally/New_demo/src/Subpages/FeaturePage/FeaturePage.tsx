import React from "react";
import { FeatureHero } from "./FeatureHero";
import { AccessControlSection } from "./AccessControlSection";
import { MoreFeaturesSection } from "./MoreFeaturesSection";
import { PrivacySection } from "./PrivacySection";

const FeaturePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <FeatureHero />
      <AccessControlSection />
      <MoreFeaturesSection />
      <PrivacySection />
    </main>
  );
};

export default FeaturePage;
