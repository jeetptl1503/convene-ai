import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import Sidebar from "../components/sidebar";
import AgentChat from "../components/agent-chat";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? "";
  const session = token ? await verifySession(token) : null;

  const userName = session?.name ?? "Guest";
  const userEmail = session?.email ?? "";

  return (
    <div className="flex min-h-screen">
      <Sidebar userName={userName} userEmail={userEmail} />
      <main className="flex-1 ml-64 p-8">{children}</main>
      <AgentChat />
    </div>
  );
}
