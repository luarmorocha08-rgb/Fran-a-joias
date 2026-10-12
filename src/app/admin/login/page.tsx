import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Entrar" };

export default async function LoginPage() {
  const session = await getAdminSession();
  if (session.status === "demo") return <SetupNotice />;
  if (session.status === "admin") redirect("/admin");
  return <LoginForm forbidden={session.status === "forbidden"} />;
}
