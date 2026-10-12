import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { SetupNotice } from "@/components/admin/SetupNotice";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (session.status === "demo") return <SetupNotice />;
  if (session.status !== "admin") redirect("/admin/login");
  return (
    <div className="lg:pl-64">
      <AdminNav email={session.user.email ?? ""} />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">{children}</div>
    </div>
  );
}
