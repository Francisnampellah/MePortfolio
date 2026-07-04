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
      { label: "Introduction", href: "/namps-native" },
      { label: "Installation", href: "/namps-native/docs/getting-started" },
      { label: "Theming", href: "/namps-native/docs/theming" },
    ],
  },
  {
    label: "Foundations",
    items: [
      { label: "Colors", href: "/namps-native/foundations/colors" },
      { label: "Typography", href: "/namps-native/foundations/typography" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Buttons", href: "/namps-native/components/buttons" },
      { label: "Forms", href: "/namps-native/components/forms" },
      { label: "Display", href: "/namps-native/components/display" },
    ],
  },
];
