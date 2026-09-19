"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { DeliverablesGrid } from "./DeliverablesGrid";
import { ShowcaseSection } from "./ShowcaseSection";
import { StageFlowSection } from "./StageFlowSection";
import { BentoFeatures } from "./BentoFeatures";
import { BeforeAfter } from "./BeforeAfter";
import { TestDriveSection } from "./TestDriveSection";
import { FaqFooter } from "./FaqFooter";

export function LandingPage() {
  return (
    <main className="relative min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section with Clean Product Command Center Mockup */}
      <Hero />

      {/* What We Offer: 8 Core Platform Deliverables Grid */}
      <DeliverablesGrid />

      {/* Interactive Capability Matrix / 5-Tab Showcase */}
      <ShowcaseSection />

      {/* PS-5: Dedicated Smart Anchor & Live Stage Flow Showcase */}
      <StageFlowSection />

      {/* Bento Grid Features */}
      <BentoFeatures />

      {/* Before / After Operational Comparison */}
      <BeforeAfter />

      {/* Live Crisis Test-Drive */}
      <TestDriveSection />

      {/* FAQ & Final Call-To-Action Banner */}
      <FaqFooter />
    </main>
  );
}
