import type { Metadata } from "next";
import { ThemeProvider, ToastProvider } from "namps-ui";
import { Shell } from "@/components/namps-ui/Shell";
import "namps-ui/styles.css";
import "./namps-ui-docs.css";

export const metadata: Metadata = {
  title: "namps-ui — Anthropic-inspired React components",
  description: "A warm, accessible component library. Documentation and live examples.",
};

export default function PaperUILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pui-docs">
      <ThemeProvider defaultTheme="light" attributeTarget="self">
        <ToastProvider>
          <Shell>{children}</Shell>
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
}
