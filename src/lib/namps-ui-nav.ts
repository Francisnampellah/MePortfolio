export interface NavItem {
  label: string;
  href: string;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    label: "Getting started",
    items: [
      { label: "Introduction", href: "/namps-ui" },
      { label: "Installation", href: "/namps-ui/docs/getting-started" },
      { label: "Theming", href: "/namps-ui/docs/theming" },
    ],
  },
  {
    label: "Foundations",
    items: [
      { label: "Colors", href: "/namps-ui/foundations/colors" },
      { label: "Typography", href: "/namps-ui/foundations/typography" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Buttons", href: "/namps-ui/components/buttons" },
      { label: "Forms", href: "/namps-ui/components/forms" },
      { label: "Display", href: "/namps-ui/components/display" },
      { label: "Disclosure", href: "/namps-ui/components/disclosure" },
      { label: "Data", href: "/namps-ui/components/data" },
      { label: "Navigation", href: "/namps-ui/components/navigation" },
      { label: "Feedback", href: "/namps-ui/components/feedback" },
      { label: "Overlays", href: "/namps-ui/components/overlays" },
      { label: "Utilities", href: "/namps-ui/components/utilities" },
    ],
  },
];
