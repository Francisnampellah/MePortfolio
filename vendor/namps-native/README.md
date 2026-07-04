# Clay — React Native UI Library

A calm, premium, **token-driven** component library for React Native. Typography-first, fully typed, dark-mode native, and designed to be **predictable enough for AI coding agents to generate correctly with little guidance**.

> Visual reference: open **`Clay UI.dc.html`** in the project root for the full living design system — every token and component, light & dark.

---

## Why Clay

- **Token-driven** — no component hardcodes a color, space, or radius. Everything resolves from the theme, so dark mode and custom brands work with zero component changes.
- **One consistent API** — the same `variant`, `size`, `loading`, `disabled`, `onPress`/`onValueChange`, and `style` props recur everywhere. Learn one component, predict the rest.
- **Composition over configuration** — small primitives assemble into rich screens.
- **Fully typed** — every prop, hook, and token is exported and JSDoc-documented.
- **Tree-shakeable** — `sideEffects: false` + per-component entry points; importing `Button` never pulls in `BottomSheet`.

## Install

```sh
npm i @clay/ui react-native-reanimated react-native-gesture-handler react-native-svg
```

Load the fonts (`Newsreader`, `Geist`, `JetBrainsMono`) via `expo-font`, and add the Reanimated Babel plugin.

## Quickstart

```tsx
import { ThemeProvider, Card, Heading, Text, Button } from '@clay/ui';

export default function App() {
  return (
    <ThemeProvider defaultPreference="system">
      <Card variant="elevated" padding={5}>
        <Heading level={3}>Weekly digest</Heading>
        <Text tone="muted">Everything that changed while you were away.</Text>
        <Button onPress={open}>Open report</Button>
      </Card>
    </ThemeProvider>
  );
}
```

See **`example/App.tsx`** for a fuller screen.

## Theming

```tsx
import { ThemeProvider, createTheme, lightTheme } from '@clay/ui';

// Override only what you need — the rest inherits.
const brand = createTheme(lightTheme, { colors: { accent: '#2A6FDB' } });

<ThemeProvider light={brand}>…</ThemeProvider>
```

Read tokens anywhere:

```tsx
const theme = useTheme();
<View style={{ backgroundColor: theme.colors.surface, padding: theme.space[4], borderRadius: theme.radius.lg }} />;
```

Control the scheme: `const { scheme, toggle, setPreference } = useColorSchemeControl();`

## Design tokens

| Group | Access | Notes |
|---|---|---|
| Color (semantic) | `theme.colors.*` | `bg surface elevated sunken border text textMuted accent onAccent success warning danger info` (+ `*Soft`) |
| Spacing | `theme.space[1..12]` | 4-point scale (`space[4] === 16`) |
| Radius | `theme.radius.{sm,md,lg,xl,full}` | |
| Type | `theme.fontSize` · `fontFamily` · `fontWeight` · `lineHeight` | serif display / grotesque body / mono |
| Elevation | `theme.shadow.{sm,md,lg}` | warm-tinted, deepen in dark |
| Motion | `theme.motion.duration` · `theme.motion.easing` | `easing.standard = [0.2,0,0,1]` |
| Sizing | `theme.sizing.{sm,md,lg}` | shared control heights/padding |

Raw primitives and scales are also exported: `import { tokens } from '@clay/ui'`.

## Conventions (read this before generating UI)

Every interactive component follows these rules — rely on them:

- **Variants:** `primary · secondary · soft · ghost · danger`
- **Sizes:** `sm · md · lg`
- **State:** stateful inputs are controlled via `value` + `onValueChange` (or `onChangeText`), or uncontrolled via `defaultValue`. Use the `useControllableState` hook for your own.
- **Loading / disabled:** `loading` shows a spinner and blocks presses; `disabled` dims and blocks.
- **Icons:** `leftIcon` / `rightIcon` on Button; `icon` on IconButton. Icons take `size` + `color`, inherit `currentColor`.
- **Events:** `onPress` for actions, `onValueChange` for values, `onClose` for overlays.
- **Styling overrides:** every component takes `style` (merged onto the root) and `testID`.
- **Accessibility:** roles are set automatically. **Icon-only controls require `accessibilityLabel`.** Tap targets are ≥44px.

## Components

**Implemented in this scaffold** (reference implementations, fully typed + tested pattern):
`Button` · `IconButton` · `Text` · `Heading` · `Card` · `Input` · `Switch` · `Checkbox` · `Badge`

**Specified & designed** (in `Clay UI.dc.html`), to implement following the same folder + prop conventions:
`TextArea` · `Radio` · `SearchBar` · `Chip` · `Avatar`/`AvatarGroup` · `Divider` · `List` · `Accordion` · `Tabs` · `Progress` · `Spinner` · `Skeleton` · `Alert` · `Banner` · `Toast` · `Snackbar` · `Modal` · `Dialog` · `BottomSheet` · `Popover` · `Menu` · `Dropdown` · `NavigationBar` · `FloatingActionButton`

Each component lives in `src/components/<Name>/` with `<Name>.tsx`, `index.ts`, `<Name>.stories.tsx`, and `<Name>.test.tsx`. Copy `Button` (variants/sizes/loading) or `Switch` (controlled state + Reanimated) as the template.

## Project structure

```
clay-ui/
├─ src/
│  ├─ theme/       tokens.ts · themes.ts · ThemeProvider.tsx · useTheme.ts
│  ├─ hooks/       useControllableState · useDisclosure
│  ├─ utils/       color helpers
│  ├─ icons/       line icon set (24×24, 1.7 stroke, currentColor)
│  ├─ components/  one folder per component
│  ├─ types.ts     shared Variant/Size/Status/Styleable/A11y types
│  └─ index.ts     public API
├─ example/        Expo demo app
├─ .storybook/     stories config
├─ .github/        CI (typecheck · lint · test · build · release)
├─ tsup.config.ts  ESM+CJS+d.ts, tree-shaking
└─ tsconfig.json
```

## Scripts

`npm run build` · `dev` · `typecheck` · `lint` · `test` · `storybook`

## License

MIT
