# namps-ui

A warm, accessible React component library inspired by Anthropic's design language — paper-warm surfaces, a confident clay accent, an editorial type system, and a complete set of primitives. Ships a single CSS file with light/dark theming via a `data-theme` attribute.

[![npm version](https://img.shields.io/npm/v/namps-ui.svg)](https://www.npmjs.com/package/namps-ui)
[![license](https://img.shields.io/npm/l/namps-ui.svg)](https://www.npmjs.com/package/namps-ui)

> **Note on fonts:** Anthropic's typefaces (Styrene, Tiempos) are proprietary. This library uses close free substitutes (Hanken Grotesk, Newsreader). Override `--pui-font-*` tokens to use your own fonts.

## Install

```bash
npm install namps-ui
```

Peer dependencies: `react >= 18`, `react-dom >= 18`.

## Setup

Import the stylesheet once at your app root and wrap your tree in the providers you need:

```tsx
import { ThemeProvider, ToastProvider } from "namps-ui";
import "namps-ui/styles.css";

export default function App({ children }) {
  return (
    <ThemeProvider defaultTheme="light">
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
```

`ThemeProvider` stamps `data-theme="light|dark"` on `<html>` and persists the choice to `localStorage`. Use the `ThemeToggle` component or `useTheme()` to switch.

### Next.js

Add the package to `transpilePackages` in `next.config`:

```js
const nextConfig = {
  transpilePackages: ["namps-ui"],
};
```

## Usage

```tsx
import { Button, Field, Input, Badge, Table, useToast, Icons } from "namps-ui";

function Example() {
  const { toast } = useToast();
  return (
    <>
      <Field label="Workspace name" hint="Visible to all members.">
        <Input defaultValue="Acme AI" />
      </Field>
      <Button
        leftIcon={<Icons.Plus className="pui-icon" />}
        onClick={() => toast({ tone: "success", title: "Saved" })}
      >
        Save
      </Button>
      <Badge tone="green" dot>
        Active
      </Badge>
    </>
  );
}
```

## Components

| Group | Exports |
| --- | --- |
| **Actions** | `Button` |
| **Forms** | `Field`, `Input`, `SearchInput`, `Textarea`, `Select`, `Checkbox`, `Switch`, `RadioGroup`, `Slider` |
| **Display** | `Badge`, `Tag`, `Avatar`, `AvatarGroup`, `Card`, `StatCard`, `Progress`, `Spinner`, `Skeleton`, `EmptyState` |
| **Disclosure** | `Accordion` + `AccordionItem`, `Tabs` + `TabList` / `Tab` / `TabPanel` |
| **Data** | `Table` (typed, sortable) |
| **Navigation** | `Breadcrumbs`, `Pagination`, `Segmented` |
| **Feedback** | `Alert`, `ToastProvider` + `useToast` |
| **Overlay** | `Modal`, `Tooltip`, `DropdownMenu` + `MenuSeparator`, `Popover`, `Drawer` |
| **Utilities** | `Separator`, `Kbd`, `Link`, `ToggleGroup`, `Stepper`, `CodeBlock`, `List` + `ListItem` |
| **Theme** | `ThemeProvider`, `useTheme`, `ThemeToggle` |
| **Icons** | `Icons.*` (stroke icon set) |
| **Helpers** | `cx`, `initials` |

Every component is individually tree-shakeable and fully typed.

## Theming

All visual values are CSS custom properties prefixed `--pui-*`, defined for `[data-theme="light"]` and `[data-theme="dark"]` in `styles.css`. Override them anywhere in your own CSS to re-skin:

```css
:root {
  --pui-accent: #4f7a5b;        /* change the brand accent */
  --pui-radius: 12px;           /* rounder corners everywhere */
  --pui-font-sans: "Inter", system-ui, sans-serif;
}
```

Key tokens: `--pui-bg`, `--pui-panel`, `--pui-card`, `--pui-text`, `--pui-muted`, `--pui-border`, `--pui-accent`, `--pui-green / amber / red / blue`, `--pui-radius*`, `--pui-shadow*`, `--pui-font-*`.

## Develop

From this folder:

```bash
npm install
npm run build      # bundle with tsup → dist/ (esm + cjs + d.ts + styles.css)
npm run dev        # watch mode
npm run typecheck
```

From the monorepo root:

```bash
npm run build:lib
npm run dev        # builds the library, then starts the example app
```

## Publish

Publishing is free for public packages. From this folder:

```bash
npm login
npm publish --access public
```

If 2FA is enabled, npm will prompt for a one-time password from your authenticator app:

```bash
npm publish --access public --otp=123456
```

`prepublishOnly` runs build + typecheck automatically before `npm publish`.

### Test locally before publishing

```bash
npm run build
npm pack                 # creates namps-ui-0.1.0.tgz in this folder
cd ../example
npm install ../paper-ui/namps-ui-0.1.0.tgz
```

## Links

- [npm package](https://www.npmjs.com/package/namps-ui)
- [GitHub](https://github.com/Francisnampellah)

## License

MIT
