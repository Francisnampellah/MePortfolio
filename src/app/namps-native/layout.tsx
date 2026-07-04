import type { Metadata } from "next";
import { Shell } from "@/components/namps-native/Shell";
import "namps-ui/styles.css";
import "./namps-native-docs.css";

export const metadata: Metadata = {
  title: "namps-native — React Native design system",
  description: "A calm, token-driven React Native component library. Documentation and live examples.",
};

export default function NampsNativeLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
