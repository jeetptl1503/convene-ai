import Sidebar from "../components/sidebar";
import AgentChat from "../components/agent-chat";
import { getSessionUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 ml-64 p-8">{children}</main>
      <AgentChat />
    </div>
  );
}
