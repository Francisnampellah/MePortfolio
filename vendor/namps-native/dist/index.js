'use strict';

var React2 = require('react');
var reactNative = require('react-native');
var Svg = require('react-native-svg');
var Animated2 = require('react-native-reanimated');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React2__default = /*#__PURE__*/_interopDefault(React2);
var Svg__default = /*#__PURE__*/_interopDefault(Svg);
var Animated2__default = /*#__PURE__*/_interopDefault(Animated2);

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/theme/tokens.ts
var tokens_exports = {};
__export(tokens_exports, {
  fontFamily: () => fontFamily,
  fontSize: () => fontSize,
  fontWeight: () => fontWeight,
  lineHeight: () => lineHeight,
  motion: () => motion,
  palette: () => palette,
  radius: () => radius,
  sizing: () => sizing,
  space: () => space
});
var palette = {
  // Warm paper neutrals
  sand50: "#FBFAF6",
  sand100: "#F3F0E8",
  sand200: "#EAE6DB",
  sand300: "#E5E0D4",
  sand400: "#D4CDBD",
  sand500: "#9C9482",
  sand600: "#6B6555",
  sand700: "#413C33",
  sand800: "#211E18",
  sand900: "#191712",
  ink: "#201E1A",
  paperWhite: "#FFFFFF",
  // Clay accent
  clay400: "#D6805C",
  clay500: "#C15F3C",
  clay600: "#A64E2E",
  clay100: "#F1E1D8",
  // Semantic hues
  green500: "#47795B",
  green400: "#6EA687",
  amber500: "#9E6E1B",
  amber400: "#CDA052",
  red500: "#B0463B",
  red400: "#D67E71",
  blue500: "#3F6591",
  blue400: "#7FA4CF"
};
var space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 64
};
var radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999
};
var fontSize = {
  xs: 12,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 22,
  "2xl": 28,
  "3xl": 34,
  display: 46
};
var lineHeight = {
  tight: 1.15,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.6
};
var fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700"
};
var fontFamily = {
  display: "Newsreader",
  body: "Geist",
  mono: "JetBrainsMono"
};
var motion = {
  duration: { fast: 120, base: 220, slow: 340 },
  /** Reanimated: `Easing.bezier(...motion.easing.standard)`. */
  easing: {
    standard: [0.2, 0, 0, 1],
    decelerate: [0, 0, 0, 1],
    accelerate: [0.4, 0, 1, 1]
  }
};
var sizing = {
  sm: { height: 34, paddingX: space[3], fontSize: fontSize.sm, radius: radius.sm, icon: 16 },
  md: { height: 44, paddingX: space[5], fontSize: fontSize.base, radius: radius.md, icon: 18 },
  lg: { height: 54, paddingX: space[6], fontSize: fontSize.md, radius: radius.lg, icon: 20 }
};

// src/theme/themes.ts
var shared = { space, radius, fontSize, lineHeight, fontWeight, fontFamily, motion, sizing };
var lightTheme = {
  name: "light",
  ...shared,
  colors: {
    bg: palette.sand100,
    surface: palette.sand50,
    elevated: palette.paperWhite,
    sunken: palette.sand200,
    border: palette.sand300,
    borderStrong: palette.sand400,
    text: palette.ink,
    textMuted: palette.sand600,
    textSubtle: palette.sand500,
    accent: palette.clay500,
    accentHover: palette.clay600,
    accentSoft: palette.clay100,
    onAccent: palette.paperWhite,
    success: palette.green500,
    successSoft: "#E1ECE4",
    warning: palette.amber500,
    warningSoft: "#F3E8D2",
    danger: palette.red500,
    dangerSoft: "#F3DED9",
    info: palette.blue500,
    infoSoft: "#DDE7F1"
  },
  shadow: {
    sm: { shadowColor: "#2B2214", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: "#2B2214", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 4 },
    lg: { shadowColor: "#2B2214", shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.14, shadowRadius: 48, elevation: 12 }
  }
};
var darkTheme = {
  name: "dark",
  ...shared,
  colors: {
    bg: palette.sand900,
    surface: palette.sand800,
    elevated: "#2A261F",
    sunken: "#131109",
    border: "#332F27",
    borderStrong: "#443F35",
    text: "#EDE8DC",
    textMuted: "#A69E8D",
    textSubtle: "#726B5C",
    accent: palette.clay400,
    accentHover: "#E4936F",
    accentSoft: "#3A2A21",
    onAccent: "#1B140F",
    success: palette.green400,
    successSoft: "#20302A",
    warning: palette.amber400,
    warningSoft: "#332916",
    danger: palette.red400,
    dangerSoft: "#3A231E",
    info: palette.blue400,
    infoSoft: "#1F2A38"
  },
  shadow: {
    sm: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.4, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 18, elevation: 6 },
    lg: { shadowColor: "#000", shadowOffset: { width: 0, height: 22 }, shadowOpacity: 0.6, shadowRadius: 55, elevation: 16 }
  }
};
function createTheme(base2, overrides = {}) {
  return deepMerge(base2, overrides);
}
function deepMerge(base2, override) {
  const out = Array.isArray(base2) ? [...base2] : { ...base2 };
  for (const key in override) {
    const v = override[key];
    if (v && typeof v === "object" && !Array.isArray(v)) out[key] = deepMerge(base2[key], v);
    else if (v !== void 0) out[key] = v;
  }
  return out;
}

// src/theme/ThemeProvider.tsx
var ThemeContext = React2.createContext(null);
function ThemeProvider({
  children,
  light = lightTheme,
  dark = darkTheme,
  defaultPreference = "system"
}) {
  const system = reactNative.useColorScheme();
  const [preference, setPreference] = React2.useState(defaultPreference);
  const scheme = preference === "system" ? system === "dark" ? "dark" : "light" : preference;
  const toggle = React2.useCallback(
    () => setPreference((p) => {
      const current = p === "system" ? system === "dark" ? "dark" : "light" : p;
      return current === "dark" ? "light" : "dark";
    }),
    [system]
  );
  const value = React2.useMemo(
    () => ({ theme: scheme === "dark" ? dark : light, scheme, preference, setPreference, toggle }),
    [scheme, preference, light, dark, toggle]
  );
  return /* @__PURE__ */ React2__default.default.createElement(ThemeContext.Provider, { value }, children);
}
function useThemeContext() {
  const ctx = React2.useContext(ThemeContext);
  if (!ctx) throw new Error("Clay: components must be rendered inside <ThemeProvider>.");
  return ctx;
}

// src/theme/useTheme.ts
function useTheme() {
  return useThemeContext().theme;
}
function useColorSchemeControl() {
  const { scheme, preference, setPreference, toggle } = useThemeContext();
  return { scheme, preference, setPreference, toggle };
}
function useControllableState(params) {
  const { value, defaultValue, onChange } = params;
  const isControlled = value !== void 0;
  const [internal, setInternal] = React2.useState(defaultValue);
  const onChangeRef = React2.useRef(onChange);
  onChangeRef.current = onChange;
  const resolved = isControlled ? value : internal;
  const setValue = React2.useCallback(
    (next) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled]
  );
  return [resolved, setValue];
}
function useDisclosure(defaultOpen = false) {
  const [isOpen, setOpen] = React2.useState(defaultOpen);
  const open = React2.useCallback(() => setOpen(true), []);
  const close = React2.useCallback(() => setOpen(false), []);
  const toggle = React2.useCallback(() => setOpen((v) => !v), []);
  return { isOpen, open, close, toggle };
}

// src/utils/color.ts
function shade(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const t = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const mix = (c) => Math.round((t - c) * p + c);
  return rgbToHex(mix(r), mix(g), mix(b));
}
function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}
var base = (size = 22) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none" });
var stroke = (color = "currentColor") => ({ stroke: color, strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" });
var SearchIcon = ({ size, color }) => /* @__PURE__ */ React2__default.default.createElement(Svg__default.default, { ...base(size) }, /* @__PURE__ */ React2__default.default.createElement(Svg.Circle, { cx: 11, cy: 11, r: 6.5, ...stroke(color) }), /* @__PURE__ */ React2__default.default.createElement(Svg.Path, { d: "m20 20-3.6-3.6", ...stroke(color) }));
var PlusIcon = ({ size, color }) => /* @__PURE__ */ React2__default.default.createElement(Svg__default.default, { ...base(size) }, /* @__PURE__ */ React2__default.default.createElement(Svg.Path, { d: "M12 5v14M5 12h14", ...stroke(color) }));
var CheckIcon = ({ size, color }) => /* @__PURE__ */ React2__default.default.createElement(Svg__default.default, { ...base(size) }, /* @__PURE__ */ React2__default.default.createElement(Svg.Path, { d: "m5 12.5 4.5 4.5L19 7", ...stroke(color), strokeWidth: 2 }));
var ChevronRightIcon = ({ size, color }) => /* @__PURE__ */ React2__default.default.createElement(Svg__default.default, { ...base(size) }, /* @__PURE__ */ React2__default.default.createElement(Svg.Path, { d: "m9 6 6 6-6 6", ...stroke(color) }));
var CloseIcon = ({ size, color }) => /* @__PURE__ */ React2__default.default.createElement(Svg__default.default, { ...base(size) }, /* @__PURE__ */ React2__default.default.createElement(Svg.Path, { d: "m6 6 12 12M18 6 6 18", ...stroke(color), strokeWidth: 1.8 }));
var BellIcon = ({ size, color }) => /* @__PURE__ */ React2__default.default.createElement(Svg__default.default, { ...base(size) }, /* @__PURE__ */ React2__default.default.createElement(Svg.Path, { d: "M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5", ...stroke(color) }), /* @__PURE__ */ React2__default.default.createElement(Svg.Path, { d: "M10.5 19a1.8 1.8 0 0 0 3 0", ...stroke(color) }));
var AView = Animated2__default.default.createAnimatedComponent(reactNative.View);
function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID
}) {
  const theme = useTheme();
  const dim = theme.sizing[size];
  const pressed = Animated2.useSharedValue(0);
  const isDisabled = disabled || loading;
  const palette2 = getVariant(variant, theme);
  const animatedStyle = Animated2.useAnimatedStyle(() => ({
    opacity: Animated2.withTiming(pressed.value ? 0.9 : 1, { duration: theme.motion.duration.fast }),
    transform: [{ scale: Animated2.withTiming(pressed.value ? 0.98 : 1, { duration: theme.motion.duration.fast }) }]
  }), [theme]);
  return /* @__PURE__ */ React2__default.default.createElement(
    reactNative.Pressable,
    {
      onPress,
      onPressIn: () => pressed.value = 1,
      onPressOut: () => pressed.value = 0,
      disabled: isDisabled,
      accessibilityRole: "button",
      accessibilityState: { disabled: isDisabled, busy: loading },
      accessibilityLabel,
      accessibilityHint,
      testID,
      style: fullWidth ? { alignSelf: "stretch" } : void 0
    },
    /* @__PURE__ */ React2__default.default.createElement(
      AView,
      {
        style: [
          {
            height: dim.height,
            paddingHorizontal: dim.paddingX,
            borderRadius: dim.radius,
            backgroundColor: palette2.bg,
            borderWidth: palette2.borderWidth,
            borderColor: palette2.border,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.space[2],
            opacity: isDisabled ? 0.55 : 1
          },
          animatedStyle,
          style
        ]
      },
      loading ? /* @__PURE__ */ React2__default.default.createElement(reactNative.ActivityIndicator, { size: "small", color: palette2.fg }) : /* @__PURE__ */ React2__default.default.createElement(React2__default.default.Fragment, null, leftIcon, children != null && /* @__PURE__ */ React2__default.default.createElement(reactNative.Text, { style: { color: palette2.fg, fontSize: dim.fontSize, fontFamily: theme.fontFamily.body, fontWeight: theme.fontWeight.semibold } }, children), rightIcon)
    )
  );
}
function getVariant(variant, theme, _disabled) {
  const c = theme.colors;
  switch (variant) {
    case "secondary":
      return { bg: c.elevated, fg: c.text, border: c.borderStrong, borderWidth: 1 };
    case "soft":
      return { bg: c.accentSoft, fg: c.accent, border: "transparent", borderWidth: 0 };
    case "ghost":
      return { bg: "transparent", fg: c.text, border: "transparent", borderWidth: 0 };
    case "danger":
      return { bg: c.danger, fg: "#fff", border: "transparent", borderWidth: 0 };
    case "primary":
    default:
      return { bg: c.accent, fg: c.onAccent, border: "transparent", borderWidth: 0 };
  }
}
function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  round = false,
  disabled = false,
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID
}) {
  const theme = useTheme();
  const dim = theme.sizing[size];
  const c = theme.colors;
  const bg = variant === "primary" ? c.accent : variant === "danger" ? c.danger : variant === "soft" ? c.accentSoft : variant === "secondary" ? c.elevated : "transparent";
  const border = variant === "secondary" ? c.borderStrong : "transparent";
  return /* @__PURE__ */ React2__default.default.createElement(
    reactNative.Pressable,
    {
      onPress,
      disabled,
      accessibilityRole: "button",
      accessibilityLabel,
      accessibilityHint,
      accessibilityState: { disabled },
      testID,
      style: ({ pressed }) => [
        {
          width: dim.height,
          height: dim.height,
          borderRadius: round ? theme.radius.full : dim.radius,
          backgroundColor: bg,
          borderWidth: variant === "secondary" ? 1 : 0,
          borderColor: border,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1
        },
        style
      ]
    },
    /* @__PURE__ */ React2__default.default.createElement(reactNative.View, null, icon)
  );
}
function Text2({ children, variant = "body", tone = "default", weight, align, style, ...rest }) {
  const theme = useTheme();
  const v = {
    body: { fontSize: theme.fontSize.base, lineHeight: theme.fontSize.base * theme.lineHeight.relaxed, family: theme.fontFamily.body },
    bodyLg: { fontSize: theme.fontSize.lg, lineHeight: theme.fontSize.lg * theme.lineHeight.relaxed, family: theme.fontFamily.body },
    label: { fontSize: theme.fontSize.sm, lineHeight: theme.fontSize.sm * theme.lineHeight.snug, family: theme.fontFamily.body },
    caption: { fontSize: theme.fontSize.xs, lineHeight: theme.fontSize.xs * theme.lineHeight.snug, family: theme.fontFamily.body },
    mono: { fontSize: theme.fontSize.sm, lineHeight: theme.fontSize.sm * theme.lineHeight.normal, family: theme.fontFamily.mono }
  }[variant];
  const color = {
    default: theme.colors.text,
    muted: theme.colors.textMuted,
    subtle: theme.colors.textSubtle,
    accent: theme.colors.accent,
    danger: theme.colors.danger,
    success: theme.colors.success,
    onAccent: theme.colors.onAccent
  }[tone];
  return /* @__PURE__ */ React2__default.default.createElement(
    reactNative.Text,
    {
      style: [{ color, fontSize: v.fontSize, lineHeight: v.lineHeight, fontFamily: v.family, fontWeight: weight ? theme.fontWeight[weight] : theme.fontWeight.regular, textAlign: align }, style],
      ...rest
    },
    children
  );
}
function Heading({ children, level = 2, align, tone = "default", numberOfLines, style }) {
  const theme = useTheme();
  const map = {
    1: { fontSize: theme.fontSize["3xl"], weight: theme.fontWeight.medium },
    2: { fontSize: theme.fontSize["2xl"], weight: theme.fontWeight.medium },
    3: { fontSize: theme.fontSize.xl, weight: theme.fontWeight.medium },
    4: { fontSize: theme.fontSize.lg, weight: theme.fontWeight.semibold }
  }[level];
  const color = tone === "accent" ? theme.colors.accent : tone === "onAccent" ? theme.colors.onAccent : theme.colors.text;
  return /* @__PURE__ */ React2__default.default.createElement(
    reactNative.Text,
    {
      accessibilityRole: "header",
      numberOfLines,
      style: [{ color, fontSize: map.fontSize, lineHeight: map.fontSize * theme.lineHeight.tight, fontFamily: theme.fontFamily.display, fontWeight: map.weight, letterSpacing: -0.4, textAlign: align }, style]
    },
    children
  );
}
function Card({ variant = "outlined", padding = 4, onPress, style, children, testID }) {
  const theme = useTheme();
  const c = theme.colors;
  const surface = {
    outlined: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, shadow: void 0 },
    elevated: { backgroundColor: c.elevated, borderWidth: 0, borderColor: "transparent", shadow: theme.shadow.sm },
    filled: { backgroundColor: c.sunken, borderWidth: 1, borderColor: c.border, shadow: void 0 }
  }[variant];
  const boxStyle = [
    {
      borderRadius: theme.radius.lg,
      padding: theme.space[padding],
      backgroundColor: surface.backgroundColor,
      borderWidth: surface.borderWidth,
      borderColor: surface.borderColor
    },
    surface.shadow,
    style
  ];
  if (onPress) {
    return /* @__PURE__ */ React2__default.default.createElement(reactNative.Pressable, { onPress, testID, accessibilityRole: "button", style: ({ pressed }) => [...boxStyle, { opacity: pressed ? 0.94 : 1 }] }, children);
  }
  return /* @__PURE__ */ React2__default.default.createElement(reactNative.View, { testID, style: boxStyle }, children);
}
function Input({
  label,
  helperText,
  error,
  size = "md",
  leftAdornment,
  rightAdornment,
  disabled,
  value,
  onChangeText,
  placeholder,
  style,
  testID,
  onFocus,
  onBlur,
  ...rest
}) {
  const theme = useTheme();
  const c = theme.colors;
  const dim = theme.sizing[size];
  const [focused, setFocused] = React2.useState(false);
  const hasError = !!error;
  const borderColor = hasError ? c.danger : focused ? c.accent : c.borderStrong;
  return /* @__PURE__ */ React2__default.default.createElement(reactNative.View, { style }, label && /* @__PURE__ */ React2__default.default.createElement(Text2, { variant: "label", weight: "medium", tone: hasError ? "danger" : "default", style: { marginBottom: theme.space[2] } }, label), /* @__PURE__ */ React2__default.default.createElement(
    reactNative.View,
    {
      style: {
        minHeight: dim.height,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.space[2],
        paddingHorizontal: theme.space[3] + 2,
        borderRadius: dim.radius,
        borderWidth: 1,
        borderColor,
        backgroundColor: disabled ? c.sunken : c.elevated
      }
    },
    leftAdornment,
    /* @__PURE__ */ React2__default.default.createElement(
      reactNative.TextInput,
      {
        value,
        onChangeText,
        placeholder,
        placeholderTextColor: c.textSubtle,
        editable: !disabled,
        onFocus: (e) => {
          setFocused(true);
          onFocus?.(e);
        },
        onBlur: (e) => {
          setFocused(false);
          onBlur?.(e);
        },
        testID,
        style: { flex: 1, color: disabled ? c.textSubtle : c.text, fontSize: dim.fontSize, fontFamily: theme.fontFamily.body, paddingVertical: theme.space[2] },
        ...rest
      }
    ),
    rightAdornment
  ), (error || helperText) && /* @__PURE__ */ React2__default.default.createElement(Text2, { variant: "caption", tone: hasError ? "danger" : "subtle", style: { marginTop: theme.space[1] + 2 } }, error || helperText));
}
function Switch({ value, defaultValue = false, onValueChange, disabled, accessibilityLabel, testID }) {
  const theme = useTheme();
  const [on, setOn] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const progress = Animated2.useDerivedValue(() => Animated2.withTiming(on ? 1 : 0, { duration: theme.motion.duration.fast }), [on]);
  const trackStyle = Animated2.useAnimatedStyle(() => ({
    backgroundColor: Animated2.interpolateColor(progress.value, [0, 1], [theme.colors.borderStrong, theme.colors.accent])
  }), [theme]);
  const thumbStyle = Animated2.useAnimatedStyle(() => ({ transform: [{ translateX: 18 * progress.value }] }), []);
  return /* @__PURE__ */ React2__default.default.createElement(
    reactNative.Pressable,
    {
      onPress: () => setOn(!on),
      disabled,
      accessibilityRole: "switch",
      accessibilityState: { checked: on, disabled },
      accessibilityLabel,
      testID,
      hitSlop: 10,
      style: { opacity: disabled ? 0.5 : 1 }
    },
    /* @__PURE__ */ React2__default.default.createElement(Animated2__default.default.View, { style: [{ width: 44, height: 26, borderRadius: theme.radius.full, padding: 3, justifyContent: "center" }, trackStyle] }, /* @__PURE__ */ React2__default.default.createElement(Animated2__default.default.View, { style: [{ width: 20, height: 20, borderRadius: theme.radius.full, backgroundColor: "#fff" }, theme.shadow.sm, thumbStyle] }))
  );
}
function Checkbox({ value, defaultValue = false, onValueChange, label, disabled, accessibilityLabel, testID }) {
  const theme = useTheme();
  const [checked, setChecked] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const c = theme.colors;
  return /* @__PURE__ */ React2__default.default.createElement(
    reactNative.Pressable,
    {
      onPress: () => setChecked(!checked),
      disabled,
      accessibilityRole: "checkbox",
      accessibilityState: { checked, disabled },
      accessibilityLabel: accessibilityLabel ?? label,
      testID,
      hitSlop: 8,
      style: { flexDirection: "row", alignItems: "center", gap: theme.space[3], opacity: disabled ? 0.5 : 1 }
    },
    /* @__PURE__ */ React2__default.default.createElement(
      reactNative.View,
      {
        style: {
          width: 22,
          height: 22,
          borderRadius: 7,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: checked ? c.accent : "transparent",
          borderWidth: checked ? 0 : 1.8,
          borderColor: c.borderStrong
        }
      },
      checked && /* @__PURE__ */ React2__default.default.createElement(CheckIcon, { size: 14, color: "#fff" })
    ),
    label && /* @__PURE__ */ React2__default.default.createElement(Text2, { variant: "body" }, label)
  );
}
function Badge({ children, status = "neutral", dot = false, style, testID }) {
  const theme = useTheme();
  const c = theme.colors;
  const map = {
    info: { bg: c.infoSoft, fg: c.info },
    success: { bg: c.successSoft, fg: c.success },
    warning: { bg: c.warningSoft, fg: c.warning },
    danger: { bg: c.dangerSoft, fg: c.danger },
    neutral: { bg: c.sunken, fg: c.textMuted }
  };
  const tone = map[status];
  return /* @__PURE__ */ React2__default.default.createElement(reactNative.View, { testID, style: [{ flexDirection: "row", alignItems: "center", gap: theme.space[1] + 2, height: 24, paddingHorizontal: theme.space[2] + 2, borderRadius: theme.radius.full, backgroundColor: tone.bg }, style] }, dot && /* @__PURE__ */ React2__default.default.createElement(reactNative.View, { style: { width: 6, height: 6, borderRadius: 3, backgroundColor: tone.fg } }), /* @__PURE__ */ React2__default.default.createElement(Text2, { variant: "caption", weight: "semibold", style: { color: tone.fg } }, children));
}

exports.Badge = Badge;
exports.BellIcon = BellIcon;
exports.Button = Button;
exports.Card = Card;
exports.CheckIcon = CheckIcon;
exports.Checkbox = Checkbox;
exports.ChevronRightIcon = ChevronRightIcon;
exports.CloseIcon = CloseIcon;
exports.Heading = Heading;
exports.IconButton = IconButton;
exports.Input = Input;
exports.PlusIcon = PlusIcon;
exports.SearchIcon = SearchIcon;
exports.Switch = Switch;
exports.Text = Text2;
exports.ThemeProvider = ThemeProvider;
exports.createTheme = createTheme;
exports.darkTheme = darkTheme;
exports.lightTheme = lightTheme;
exports.shade = shade;
exports.tokens = tokens_exports;
exports.useColorSchemeControl = useColorSchemeControl;
exports.useControllableState = useControllableState;
exports.useDisclosure = useDisclosure;
exports.useTheme = useTheme;
exports.withAlpha = withAlpha;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map