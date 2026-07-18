import type { Metadata } from "next";
import { ThemeProvider, ToastProvider } from "namps-ui";
import "namps-ui/styles.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Content Manager",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cms-root">
      <ThemeProvider defaultTheme="light" attributeTarget="self">
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </div>
  );
}
