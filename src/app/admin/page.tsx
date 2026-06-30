import { cookies } from "next/headers";
import type { Metadata } from "next";
import { expectedToken, SESSION_COOKIE } from "@/lib/cms";
import { LoginForm } from "./LoginForm";
import { AdminClient } from "./AdminClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Content Manager",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const authed = cookies().get(SESSION_COOKIE)?.value === expectedToken();
  return (
    <div className="min-h-screen bg-surface">
      {authed ? <AdminClient /> : <LoginForm />}
    </div>
  );
}
