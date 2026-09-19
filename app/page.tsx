import { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Convene AI — Autonomous Campus Club Operations & Event Planning",
  description:
    "The autonomous operations and event planning platform for campus clubs. Powered by Google Gemini 2.5 and Supabase PostgreSQL with pgvector semantic search.",
  keywords: [
    "ClubOps",
    "Event Planning",
    "Campus Events",
    "Gemini 2.5",
    "Supabase",
    "pgvector",
    "AI Copilot",
    "Volunteer Management",
    "Kanban",
  ],
  openGraph: {
    title: "Convene AI — Autonomous Campus Club Operations Platform",
    description:
      "Plan campus events backward from launch day, convert WhatsApp chats into database tasks, balance volunteer workloads, and track dependencies with an AI agent that takes real action.",
    type: "website",
  },
};

export default function Home() {
  return <LandingPage />;
}
