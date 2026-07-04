import React from 'react';
import { StyleProp, ViewStyle, TextStyle, GestureResponderEvent, TextProps as TextProps$1, ViewProps, TextInputProps } from 'react-native';

/**
 * Clay design tokens — the single source of truth for the whole library.
 *
 * Tokens are grouped by concern (color, space, radius, etc). No component may
 * hardcode a raw value; everything reads from the resolved theme. This is what
 * makes theming, dark mode, and custom brands work with zero component changes.
 *
 * Palette tokens are theme-independent primitives. Semantic color tokens
 * (see `themes.ts`) map light/dark values onto meaning (`bg`, `text`, `accent`…).
 */
/** Raw color primitives. Never consumed directly by components — use semantic tokens. */
declare const palette: {
    readonly sand50: "#FBFAF6";
    readonly sand100: "#F3F0E8";
    readonly sand200: "#EAE6DB";
    readonly sand300: "#E5E0D4";
    readonly sand400: "#D4CDBD";
    readonly sand500: "#9C9482";
    readonly sand600: "#6B6555";
    readonly sand700: "#413C33";
    readonly sand800: "#211E18";
    readonly sand900: "#191712";
    readonly ink: "#201E1A";
    readonly paperWhite: "#FFFFFF";
    readonly clay400: "#D6805C";
    readonly clay500: "#C15F3C";
    readonly clay600: "#A64E2E";
    readonly clay100: "#F1E1D8";
    readonly green500: "#47795B";
    readonly green400: "#6EA687";
    readonly amber500: "#9E6E1B";
    readonly amber400: "#CDA052";
    readonly red500: "#B0463B";
    readonly red400: "#D67E71";
    readonly blue500: "#3F6591";
    readonly blue400: "#7FA4CF";
};
/** 4-point spacing scale. `space[4] === 16`. */
declare const space: {
    readonly 0: 0;
    readonly 1: 4;
    readonly 2: 8;
    readonly 3: 12;
    readonly 4: 16;
    readonly 5: 20;
    readonly 6: 24;
    readonly 8: 32;
    readonly 10: 40;
    readonly 12: 64;
};
/** Corner radius scale. */
declare const radius: {
    readonly none: 0;
    readonly sm: 6;
    readonly md: 10;
    readonly lg: 14;
    readonly xl: 20;
    readonly full: 999;
};
/** Type scale in px. Pair with `lineHeight` and `fontWeight`. */
declare const fontSize: {
    readonly xs: 12;
    readonly sm: 13;
    readonly base: 15;
    readonly md: 16;
    readonly lg: 18;
    readonly xl: 22;
    readonly '2xl': 28;
    readonly '3xl': 34;
    readonly display: 46;
};
declare const lineHeight: {
    readonly tight: 1.15;
    readonly snug: 1.35;
    readonly normal: 1.5;
    readonly relaxed: 1.6;
};
declare const fontWeight: {
    readonly regular: "400";
    readonly medium: "500";
    readonly semibold: "600";
    readonly bold: "700";
};
/**
 * Font families. Map these to fonts loaded via expo-font / expo-google-fonts.
 * `display` is a warm serif; `body` a neutral grotesque; `mono` for code/data.
 */
declare const fontFamily: {
    readonly display: "Newsreader";
    readonly body: "Geist";
    readonly mono: "JetBrainsMono";
};
/** Motion tokens — durations in ms. Easing lives in `motion.easing`. */
declare const motion: {
    readonly duration: {
        readonly fast: 120;
        readonly base: 220;
        readonly slow: 340;
    };
    /** Reanimated: `Easing.bezier(...motion.easing.standard)`. */
    readonly easing: {
        readonly standard: readonly [0.2, 0, 0, 1];
        readonly decelerate: readonly [0, 0, 0, 1];
        readonly accelerate: readonly [0.4, 0, 1, 1];
    };
};
/** Standard control sizes shared by Button, Input, IconButton, etc. */
declare const sizing: {
    readonly sm: {
        readonly height: 34;
        readonly paddingX: 12;
        readonly fontSize: 13;
        readonly radius: 6;
        readonly icon: 16;
    };
    readonly md: {
        readonly height: 44;
        readonly paddingX: 20;
        readonly fontSize: 15;
        readonly radius: 10;
        readonly icon: 18;
    };
    readonly lg: {
        readonly height: 54;
        readonly paddingX: 24;
        readonly fontSize: 16;
        readonly radius: 14;
        readonly icon: 20;
    };
};
type SpaceToken = keyof typeof space;
type RadiusToken = keyof typeof radius;
type FontSizeToken = keyof typeof fontSize;
type ComponentSize = keyof typeof sizing;

type tokens_ComponentSize = ComponentSize;
type tokens_FontSizeToken = FontSizeToken;
type tokens_RadiusToken = RadiusToken;
type tokens_SpaceToken = SpaceToken;
declare const tokens_fontFamily: typeof fontFamily;
declare const tokens_fontSize: typeof fontSize;
declare const tokens_fontWeight: typeof fontWeight;
declare const tokens_lineHeight: typeof lineHeight;
declare const tokens_motion: typeof motion;
declare const tokens_palette: typeof palette;
declare const tokens_radius: typeof radius;
declare const tokens_sizing: typeof sizing;
declare const tokens_space: typeof space;
declare namespace tokens {
  export { type tokens_ComponentSize as ComponentSize, type tokens_FontSizeToken as FontSizeToken, type tokens_RadiusToken as RadiusToken, type tokens_SpaceToken as SpaceToken, tokens_fontFamily as fontFamily, tokens_fontSize as fontSize, tokens_fontWeight as fontWeight, tokens_lineHeight as lineHeight, tokens_motion as motion, tokens_palette as palette, tokens_radius as radius, tokens_sizing as sizing, tokens_space as space };
}

/**
 * Semantic color tokens — the names components actually use.
 * Each theme maps meaning onto palette primitives, so switching themes (or
 * providing a custom one) never touches component code.
 */
interface ColorTokens {
    /** App canvas background. */
    bg: string;
    /** Card / sheet surface, one step above the canvas. */
    surface: string;
    /** Popovers, menus, modals — the highest surface. */
    elevated: string;
    /** Inset wells: inputs, tracks, code blocks. */
    sunken: string;
    /** Hairline borders. */
    border: string;
    /** Stronger borders and disabled fills. */
    borderStrong: string;
    /** Primary text. */
    text: string;
    /** Secondary text. */
    textMuted: string;
    /** Tertiary text, placeholders, captions. */
    textSubtle: string;
    /** Brand accent (clay). */
    accent: string;
    /** Accent pressed / hover. */
    accentHover: string;
    /** Tinted accent background for soft buttons, chips, selection. */
    accentSoft: string;
    /** Foreground on top of `accent`. */
    onAccent: string;
    success: string;
    successSoft: string;
    warning: string;
    warningSoft: string;
    danger: string;
    dangerSoft: string;
    info: string;
    infoSoft: string;
}
interface ShadowToken {
    shadowColor: string;
    shadowOffset: {
        width: number;
        height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
    /** Android */
    elevation: number;
}
interface Theme {
    name: 'light' | 'dark' | (string & {});
    colors: ColorTokens;
    space: typeof space;
    radius: typeof radius;
    fontSize: typeof fontSize;
    lineHeight: typeof lineHeight;
    fontWeight: typeof fontWeight;
    fontFamily: typeof fontFamily;
    motion: typeof motion;
    sizing: typeof sizing;
    shadow: {
        sm: ShadowToken;
        md: ShadowToken;
        lg: ShadowToken;
    };
}
/** Default light theme. */
declare const lightTheme: Theme;
/** Default dark theme. */
declare const darkTheme: Theme;
type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
/**
 * Merge a partial override onto a base theme to build a custom brand theme.
 * Only the tokens you specify change; everything else inherits.
 *
 * @example
 * const brand = createTheme(lightTheme, { colors: { accent: '#2A6FDB' } });
 */
declare function createTheme(base: Theme, overrides?: DeepPartial<Theme>): Theme;

type ColorSchemeName = 'light' | 'dark';
type ColorSchemePref = ColorSchemeName | 'system';
interface ThemeProviderProps {
    children: React.ReactNode;
    /** Override the light theme (e.g. a custom brand). Defaults to Clay's light theme. */
    light?: Theme;
    /** Override the dark theme. Defaults to Clay's dark theme. */
    dark?: Theme;
    /** Initial color-scheme preference. `system` follows the OS. Default: `system`. */
    defaultPreference?: ColorSchemePref;
}
/**
 * Provides the active theme to every Clay component. Wrap your app root once.
 *
 * @example
 * <ThemeProvider defaultPreference="system">
 *   <App />
 * </ThemeProvider>
 */
declare function ThemeProvider({ children, light, dark, defaultPreference, }: ThemeProviderProps): React.JSX.Element;

/**
 * Read the active theme (colors, spacing, radius, type, motion, shadow tokens).
 * The primary API for consuming design tokens in your own components.
 *
 * @example
 * const theme = useTheme();
 * <View style={{ backgroundColor: theme.colors.surface, padding: theme.space[4] }} />
 */
declare function useTheme(): Theme;
/**
 * Access and control the color scheme.
 * @example
 * const { scheme, toggle } = useColorSchemeControl();
 */
declare function useColorSchemeControl(): {
    scheme: ColorSchemeName;
    preference: ColorSchemePref;
    setPreference: (pref: ColorSchemePref) => void;
    toggle: () => void;
};

/**
 * Manage a value that can be either controlled (via `value` prop) or
 * uncontrolled (internal state seeded by `defaultValue`). The standard Clay
 * pattern for every stateful input (Switch, Checkbox, Tabs, Input…).
 *
 * @returns `[value, setValue]` where `setValue` calls `onChange` and, when
 * uncontrolled, updates internal state.
 */
declare function useControllableState<T>(params: {
    value?: T;
    defaultValue: T;
    onChange?: (value: T) => void;
}): [T, (next: T) => void];

interface Disclosure {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}
/**
 * Boolean open/close state for overlays (Modal, BottomSheet, Popover, Menu…).
 *
 * @example
 * const modal = useDisclosure();
 * <Button onPress={modal.open}>Open</Button>
 * <Modal visible={modal.isOpen} onClose={modal.close} />
 */
declare function useDisclosure(defaultOpen?: boolean): Disclosure;

/** Visual emphasis shared across interactive components. */
type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger';
/** Control size shared across Button, Input, IconButton, etc. */
type Size = 'sm' | 'md' | 'lg';
/** Semantic status shared across Alert, Badge, Banner, Toast, etc. */
type Status = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
/**
 * Every Clay component accepts these. Consistent overrides mean an agent that
 * learns one component can style them all.
 */
interface StyleableProps {
    /** Style override merged onto the root element. */
    style?: StyleProp<ViewStyle>;
    /** `testID` forwarded to the root for testing/automation. */
    testID?: string;
}
interface TextStyleableProps {
    style?: StyleProp<TextStyle>;
    testID?: string;
}
/** Standard accessibility props surfaced consistently. */
interface A11yProps {
    /** Accessible label. Required for icon-only controls. */
    accessibilityLabel?: string;
    /** Accessible hint describing the outcome of an action. */
    accessibilityHint?: string;
}

/** Small color helpers used internally by components. */
/** Mix `hex` with white/black by `amount` (0–1) to lighten/darken. */
declare function shade(hex: string, amount: number): string;
/** Add an alpha channel to a hex color, returning `rgba(...)`. */
declare function withAlpha(hex: string, alpha: number): string;

/**
 * Clay icon style: 24×24 grid, 1.7 stroke, round caps/joins, `currentColor`.
 * Every icon takes `size` (default 22) and `color` (default `currentColor`),
 * so it inherits text color and aligns with the type scale.
 *
 * These are a starter set — add more following the same signature.
 */
interface IconProps {
    /** Square dimension in px. Default 22. */
    size?: number;
    /** Stroke color. Default `currentColor` (inherits from text). */
    color?: string;
}
declare const SearchIcon: ({ size, color }: IconProps) => React.JSX.Element;
declare const PlusIcon: ({ size, color }: IconProps) => React.JSX.Element;
declare const CheckIcon: ({ size, color }: IconProps) => React.JSX.Element;
declare const ChevronRightIcon: ({ size, color }: IconProps) => React.JSX.Element;
declare const CloseIcon: ({ size, color }: IconProps) => React.JSX.Element;
declare const BellIcon: ({ size, color }: IconProps) => React.JSX.Element;

interface ButtonProps extends A11yProps, StyleableProps {
    /** Button label. Ignored if `children` is provided. */
    children?: React.ReactNode;
    /**
     * Visual emphasis. Default `"primary"`.
     * - `primary` — solid accent, main call to action
     * - `secondary` — outlined, neutral surface
     * - `soft` — tinted accent background, low emphasis
     * - `ghost` — text only, minimal
     * - `danger` — destructive solid
     */
    variant?: Variant;
    /** Control height & padding. Default `"md"`. */
    size?: Size;
    /** Show a spinner and block presses. Default `false`. */
    loading?: boolean;
    /** Disable the button. Default `false`. */
    disabled?: boolean;
    /** Stretch to fill the parent's width. Default `false`. */
    fullWidth?: boolean;
    /** Element rendered before the label (usually an icon). */
    leftIcon?: React.ReactNode;
    /** Element rendered after the label. */
    rightIcon?: React.ReactNode;
    /** Press handler. */
    onPress?: (e: GestureResponderEvent) => void;
}
/**
 * The primary action component.
 *
 * @remarks
 * Do: use exactly one `primary` button per view for the main action.
 * Don't: use `danger` for anything reversible — pair it with a confirm Dialog.
 * Accessibility: `role="button"` is set automatically; provide
 * `accessibilityLabel` when the label is an icon only (prefer `IconButton`).
 * Related: {@link IconButton}, {@link Card}.
 *
 * @example Basic
 * <Button onPress={save}>Save changes</Button>
 *
 * @example With icon + loading
 * <Button variant="soft" leftIcon={<PlusIcon />} loading={saving}>New</Button>
 */
declare function Button({ children, variant, size, loading, disabled, fullWidth, leftIcon, rightIcon, onPress, style, accessibilityLabel, accessibilityHint, testID, }: ButtonProps): React.JSX.Element;

interface IconButtonProps extends A11yProps, StyleableProps {
    /** The icon element. Rendered centered; sized to the control's icon token. */
    icon: React.ReactNode;
    /** Visual emphasis. Default `"ghost"`. */
    variant?: Variant;
    /** Control size. Default `"md"`. */
    size?: Size;
    /** Fully rounded (pill/circle) instead of the size radius. Default `false`. */
    round?: boolean;
    /** Disable the button. */
    disabled?: boolean;
    onPress?: (e: GestureResponderEvent) => void;
}
/**
 * A square, icon-only button. Same variants/sizes as {@link Button}.
 *
 * @remarks
 * Accessibility: `accessibilityLabel` is REQUIRED — there is no visible text.
 * Do: use for toolbar and inline actions. Don't: use for primary CTAs (use Button).
 *
 * @example
 * <IconButton icon={<CloseIcon />} accessibilityLabel="Close" onPress={close} />
 */
declare function IconButton({ icon, variant, size, round, disabled, onPress, style, accessibilityLabel, accessibilityHint, testID, }: IconButtonProps): React.JSX.Element;

type TextVariant = 'body' | 'bodyLg' | 'label' | 'caption' | 'mono';
type TextTone = 'default' | 'muted' | 'subtle' | 'accent' | 'danger' | 'success' | 'onAccent';
interface TextProps extends TextStyleableProps, Pick<TextProps$1, 'numberOfLines' | 'onPress' | 'selectable' | 'accessibilityRole'> {
    children: React.ReactNode;
    /** Type role mapped to the scale. Default `"body"`. */
    variant?: TextVariant;
    /** Color token. Default `"default"`. */
    tone?: TextTone;
    /** Font weight override. */
    weight?: 'regular' | 'medium' | 'semibold' | 'bold';
    /** Text alignment. */
    align?: 'auto' | 'left' | 'right' | 'center';
}
/**
 * The typographic primitive for all non-heading text. Keeps every string on
 * the scale and on a semantic color token.
 *
 * @remarks
 * Do: use `variant`/`tone` instead of raw `style` colors. Related: {@link Heading}.
 * @example
 * <Text variant="caption" tone="muted">Updated 2h ago</Text>
 */
declare function Text({ children, variant, tone, weight, align, style, ...rest }: TextProps): React.JSX.Element;

type HeadingLevel = 1 | 2 | 3 | 4;
interface HeadingProps extends TextStyleableProps {
    children: React.ReactNode;
    /** Visual + semantic level. 1 = largest. Default `2`. */
    level?: HeadingLevel;
    align?: 'auto' | 'left' | 'right' | 'center';
    /** Color tone. Default `"default"`. */
    tone?: 'default' | 'accent' | 'onAccent';
    numberOfLines?: number;
}
/**
 * Display headings set in the serif display family.
 *
 * @remarks
 * Do: keep one `level={1}` per screen. Related: {@link Text}.
 * @example
 * <Heading level={1}>Good morning</Heading>
 */
declare function Heading({ children, level, align, tone, numberOfLines, style }: HeadingProps): React.JSX.Element;

type CardVariant = 'outlined' | 'elevated' | 'filled';
interface CardProps extends StyleableProps, Pick<ViewProps, 'children'> {
    /** Surface treatment. Default `"outlined"`. */
    variant?: CardVariant;
    /** Inner padding, using a space token key. Default `4` (16px). */
    padding?: keyof ReturnType<typeof useTheme>['space'];
    /** Makes the whole card pressable with a subtle feedback state. */
    onPress?: (e: GestureResponderEvent) => void;
}
/**
 * The primary container surface. Maps its variant straight to elevation tokens.
 *
 * @remarks
 * Do: nest {@link Heading}/{@link Text} for content. Don't: stack elevated cards
 * on elevated cards — flatten to `outlined` inside. Related: {@link Card}, {@link List}.
 * @example
 * <Card variant="elevated" padding={5}>
 *   <Heading level={4}>Weekly digest</Heading>
 *   <Text tone="muted">Everything that changed.</Text>
 * </Card>
 */
declare function Card({ variant, padding, onPress, style, children, testID }: CardProps): React.JSX.Element;

interface InputProps extends StyleableProps, Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'secureTextEntry' | 'keyboardType' | 'autoCapitalize' | 'autoFocus' | 'onBlur' | 'onFocus' | 'multiline'> {
    /** Field label rendered above the control. */
    label?: string;
    /** Helper text below the control. Replaced by `error` when present. */
    helperText?: string;
    /** Error message. Sets the error visual state and replaces `helperText`. */
    error?: string;
    /** Control size. Default `"md"`. */
    size?: Size;
    /** Element rendered inside, before the text. */
    leftAdornment?: React.ReactNode;
    /** Element rendered inside, after the text. */
    rightAdornment?: React.ReactNode;
    disabled?: boolean;
}
/**
 * Single-line text field. Anatomy: label · control · helper/error.
 *
 * @remarks
 * State: controlled via `value`/`onChangeText`. Error recolors border, ring,
 * and helper together. Related: {@link TextArea}, {@link SearchBar}.
 * @example
 * <Input label="Email" value={email} onChangeText={setEmail} error={emailError} />
 */
declare function Input({ label, helperText, error, size, leftAdornment, rightAdornment, disabled, value, onChangeText, placeholder, style, testID, onFocus, onBlur, ...rest }: InputProps): React.JSX.Element;

interface SwitchProps extends A11yProps {
    /** Controlled on/off value. */
    value?: boolean;
    /** Uncontrolled initial value. Default `false`. */
    defaultValue?: boolean;
    /** Called with the next value on toggle. */
    onValueChange?: (value: boolean) => void;
    disabled?: boolean;
    testID?: string;
}
/**
 * A binary on/off toggle with a spring-free, calm slide (Reanimated).
 *
 * @remarks
 * State: controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`).
 * Tap target stays ≥44px even though the track is smaller.
 * Related: {@link Checkbox}, {@link Radio}.
 * @example
 * <Switch value={wifi} onValueChange={setWifi} accessibilityLabel="Wi-Fi" />
 */
declare function Switch({ value, defaultValue, onValueChange, disabled, accessibilityLabel, testID }: SwitchProps): React.JSX.Element;

interface CheckboxProps extends A11yProps {
    /** Controlled checked value. */
    value?: boolean;
    /** Uncontrolled initial value. Default `false`. */
    defaultValue?: boolean;
    onValueChange?: (value: boolean) => void;
    /** Optional inline label rendered to the right. */
    label?: string;
    disabled?: boolean;
    testID?: string;
}
/**
 * A square checkbox with an optional label. Same controlled/uncontrolled API as
 * {@link Switch} and {@link Radio}.
 *
 * @remarks
 * Do: use for independent multi-select options. Use {@link Radio} for exclusive choice.
 * @example
 * <Checkbox label="Email me updates" value={on} onValueChange={setOn} />
 */
declare function Checkbox({ value, defaultValue, onValueChange, label, disabled, accessibilityLabel, testID }: CheckboxProps): React.JSX.Element;

interface BadgeProps extends StyleableProps {
    children: React.ReactNode;
    /** Semantic status → color. Default `"neutral"`. */
    status?: Status;
    /** Show a leading dot. Default `false`. */
    dot?: boolean;
}
/**
 * A small, static status marker. Uses the shared {@link Status} color set.
 *
 * @remarks
 * Do: use for state (Active, Pending, Beta). Use {@link Chip} for interactive filters.
 * @example
 * <Badge status="success" dot>Active</Badge>
 */
declare function Badge({ children, status, dot, style, testID }: BadgeProps): React.JSX.Element;

export { type A11yProps, Badge, type BadgeProps, BellIcon, Button, type ButtonProps, Card, type CardProps, type CardVariant, CheckIcon, Checkbox, type CheckboxProps, ChevronRightIcon, CloseIcon, type ColorSchemeName, type ColorSchemePref, type ColorTokens, type DeepPartial, type Disclosure, Heading, type HeadingLevel, type HeadingProps, IconButton, type IconButtonProps, type IconProps, Input, type InputProps, PlusIcon, SearchIcon, type ShadowToken, type Size, type Status, type StyleableProps, Switch, type SwitchProps, Text, type TextProps, type TextStyleableProps, type TextTone, type TextVariant, type Theme, ThemeProvider, type ThemeProviderProps, type Variant, createTheme, darkTheme, lightTheme, shade, tokens, useColorSchemeControl, useControllableState, useDisclosure, useTheme, withAlpha };
