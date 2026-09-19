import { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Convene AI — Autonomous ClubOps & Smart Stage Flow",
  description:
    "The autonomous operations and live stage management platform for campus clubs. Powered by Google Gemini 2.5 and Supabase PostgreSQL with pgvector.",
  keywords: [
    "ClubOps",
    "Smart Anchor",
    "Campus Events",
    "Gemini 2.5",
    "Supabase",
    "pgvector",
    "AI Copilot",
    "Stage Flow",
  ],
  openGraph: {
    title: "Convene AI — Autonomous ClubOps & Smart Stage Flow",
    description:
      "Plan campus events backward from event date, turn WhatsApp voice notes into assigned tasks, and command live stage flow with an AI that takes action.",
    type: "website",
  },
};

export default function Home() {
  return <LandingPage />;
}
