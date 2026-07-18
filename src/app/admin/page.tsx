import { cookies } from "next/headers";
import { expectedToken, SESSION_COOKIE } from "@/lib/cms";
import { LoginForm } from "./LoginForm";
import { AdminClient } from "./AdminClient";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const authed = cookies().get(SESSION_COOKIE)?.value === expectedToken();
  return authed ? <AdminClient /> : <LoginForm />;
}
