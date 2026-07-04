"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Accordion: () => Accordion,
  AccordionItem: () => AccordionItem,
  Alert: () => Alert,
  Avatar: () => Avatar,
  AvatarGroup: () => AvatarGroup,
  Badge: () => Badge,
  Breadcrumbs: () => Breadcrumbs,
  Button: () => Button,
  Card: () => Card,
  Checkbox: () => Checkbox,
  CodeBlock: () => CodeBlock,
  Drawer: () => Drawer,
  DropdownMenu: () => DropdownMenu,
  EmptyState: () => EmptyState,
  Field: () => Field,
  Icons: () => icons_exports,
  Input: () => Input,
  Kbd: () => Kbd,
  Link: () => Link,
  List: () => List,
  ListItem: () => ListItem,
  MenuSeparator: () => MenuSeparator,
  Modal: () => Modal,
  Pagination: () => Pagination,
  Popover: () => Popover,
  Progress: () => Progress,
  RadioGroup: () => RadioGroup,
  SearchInput: () => SearchInput,
  Segmented: () => Segmented,
  Select: () => Select,
  Separator: () => Separator,
  Skeleton: () => Skeleton,
  Slider: () => Slider,
  Spinner: () => Spinner,
  StatCard: () => StatCard,
  Stepper: () => Stepper,
  Switch: () => Switch,
  Tab: () => Tab,
  TabList: () => TabList,
  TabPanel: () => TabPanel,
  Table: () => Table,
  Tabs: () => Tabs,
  Tag: () => Tag,
  Textarea: () => Textarea,
  ThemeProvider: () => ThemeProvider,
  ThemeToggle: () => ThemeToggle,
  ToastProvider: () => ToastProvider,
  ToggleGroup: () => ToggleGroup,
  Tooltip: () => Tooltip,
  cx: () => cx,
  initials: () => initials,
  useTheme: () => useTheme,
  useToast: () => useToast
});
module.exports = __toCommonJS(index_exports);

// src/theme.tsx
var React = __toESM(require("react"), 1);

// src/icons.tsx
var icons_exports = {};
__export(icons_exports, {
  AlertTriangle: () => AlertTriangle,
  ArrowRight: () => ArrowRight,
  Check: () => Check,
  CheckCircle: () => CheckCircle,
  ChevronDown: () => ChevronDown,
  ChevronLeft: () => ChevronLeft,
  ChevronRight: () => ChevronRight,
  DotsVertical: () => DotsVertical,
  Info: () => Info,
  Moon: () => Moon,
  Plus: () => Plus,
  Search: () => Search,
  Sort: () => Sort,
  Sun: () => Sun,
  X: () => X,
  XCircle: () => XCircle
});
var import_jsx_runtime = require("react/jsx-runtime");
var base = (path) => function Icon({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: className ?? "pui-icon",
      "aria-hidden": "true",
      ...props,
      children: path
    }
  );
};
var ChevronDown = base(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 9l6 6 6-6" }));
var ChevronRight = base(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 6l6 6-6 6" }));
var ChevronLeft = base(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15 6l-6 6 6 6" }));
var Check = base(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12l4 4 10-10" }));
var X = base(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 6l12 12M18 6L6 18" }));
var Search = base(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "11", cy: "11", r: "7" }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 21l-4.3-4.3" })
] }));
var Plus = base(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 5v14M5 12h14" }));
var Sun = base(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "4" }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" })
] }));
var Moon = base(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" }));
var Info = base(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 11v5M12 8h.01" })
] }));
var AlertTriangle = base(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 9v4M12 17h.01" })
] }));
var CheckCircle = base(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 12l3 3 5-6" })
] }));
var XCircle = base(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15 9l-6 6M9 9l6 6" })
] }));
var ArrowRight = base(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12h14M13 6l6 6-6 6" }));
var Sort = base(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 9l4-4 4 4M8 15l4 4 4-4" }));
function DotsVertical({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: className ?? "pui-icon", "aria-hidden": "true", ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "5", r: "1.6" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "1.6" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "19", r: "1.6" })
  ] });
}

// src/utils.ts
function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}
function initials(name) {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// src/theme.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var ThemeContext = React.createContext(null);
function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "pui-theme",
  attributeTarget = "html"
}) {
  const [theme, setThemeState] = React.useState(defaultTheme);
  React.useEffect(() => {
    if (storageKey) {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark") setThemeState(stored);
    }
  }, [storageKey]);
  React.useEffect(() => {
    if (attributeTarget === "html") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    if (storageKey) window.localStorage.setItem(storageKey, theme);
  }, [theme, attributeTarget, storageKey]);
  const value = React.useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
      toggle: () => setThemeState((t) => t === "light" ? "dark" : "light")
    }),
    [theme]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ThemeContext.Provider, { value, children: attributeTarget === "self" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-theme": theme, children }) : children });
}
function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a <ThemeProvider>");
  return ctx;
}
function ThemeToggle({ className, ...props }) {
  const { theme, toggle } = useTheme();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "button",
    {
      type: "button",
      "aria-label": "Toggle color theme",
      onClick: toggle,
      className: cx("pui-btn", "pui-btn--secondary", "pui-btn--icon", className),
      ...props,
      children: theme === "light" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Moon, { className: "pui-icon" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Sun, { className: "pui-icon" })
    }
  );
}

// src/components/Button.tsx
var React2 = __toESM(require("react"), 1);
var import_jsx_runtime3 = require("react/jsx-runtime");
var Button = React2.forwardRef(function Button2({
  variant = "primary",
  size = "md",
  loading = false,
  iconOnly = false,
  block = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...props
}, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "button",
    {
      ref,
      disabled: disabled || loading,
      className: cx(
        "pui-btn",
        `pui-btn--${variant}`,
        size !== "md" && `pui-btn--${size}`,
        iconOnly && "pui-btn--icon",
        block && "pui-btn--block",
        className
      ),
      ...props,
      children: [
        loading && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "pui-btn__spinner", "aria-hidden": "true" }),
        !loading && leftIcon,
        children,
        !loading && rightIcon
      ]
    }
  );
});

// src/components/Form.tsx
var React3 = __toESM(require("react"), 1);
var import_jsx_runtime4 = require("react/jsx-runtime");
function Field({ label, hint, error, htmlFor, children, className, style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: cx("pui-field", className), style, children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { className: "pui-label", htmlFor, children: label }),
    children,
    error ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "pui-error", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(XCircle, { style: { width: 13, height: 13 } }),
      error
    ] }) : hint && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "pui-hint", children: hint })
  ] });
}
var Input = React3.forwardRef(function Input2({ invalid, className, ...props }, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "input",
    {
      ref,
      "aria-invalid": invalid || void 0,
      className: cx("pui-input", invalid && "pui-input--invalid", className),
      ...props
    }
  );
});
var SearchInput = React3.forwardRef(function SearchInput2({ className, ...props }, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "pui-input-wrap", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Search, { className: "pui-input-wrap__icon" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Input, { ref, className, ...props })
  ] });
});
var Textarea = React3.forwardRef(function Textarea2({ invalid, className, rows = 3, ...props }, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "textarea",
    {
      ref,
      rows,
      "aria-invalid": invalid || void 0,
      className: cx("pui-textarea", invalid && "pui-textarea--invalid", className),
      ...props
    }
  );
});
var Select = React3.forwardRef(function Select2({ options, className, children, ...props }, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "pui-select-wrap", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { ref, className: cx("pui-select", className), ...props, children: options ? options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: o.value, children: o.label }, o.value)) : children }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ChevronDown, { className: "pui-select-wrap__caret" })
  ] });
});
var Checkbox = React3.forwardRef(function Checkbox2({ label, disabled, className, ...props }, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: cx("pui-checkbox", disabled && "pui-checkbox--disabled", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { ref, type: "checkbox", disabled, ...props }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "pui-checkbox__box", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Check, {}) }),
    label
  ] });
});
var Switch = React3.forwardRef(function Switch2({ className, ...props }, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: cx("pui-switch", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { ref, type: "checkbox", role: "switch", ...props }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "pui-switch__track" })
  ] });
});
function RadioGroup({ name, value, onValueChange, options, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: cx("pui-radio-group", className), role: "radiogroup", children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "pui-radio-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "input",
      {
        type: "radio",
        name,
        value: o.value,
        checked: value === o.value,
        onChange: () => onValueChange(o.value)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "pui-radio-card__dot" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "pui-radio-card__title", children: o.title }),
      o.description && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "pui-radio-card__desc", children: o.description })
    ] })
  ] }, o.value)) });
}
function Slider({ value, min = 0, max = 100, onValueChange, className, ...props }) {
  const pct = (value - min) / (max - min) * 100;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: cx("pui-slider", className), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "pui-slider__row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "pui-slider__track" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "pui-slider__fill", style: { width: `${pct}%` } }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "input",
      {
        type: "range",
        min,
        max,
        value,
        onChange: (e) => onValueChange(Number(e.target.value)),
        ...props
      }
    )
  ] }) });
}

// src/components/Display.tsx
var React4 = __toESM(require("react"), 1);
var import_jsx_runtime5 = require("react/jsx-runtime");
function Badge({ tone = "neutral", solid, dot, className, children, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "span",
    {
      className: cx("pui-badge", className),
      "data-tone": tone === "neutral" ? void 0 : tone,
      "data-solid": solid || void 0,
      ...props,
      children: [
        dot && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "pui-badge__dot" }),
        children
      ]
    }
  );
}
function Tag({ onRemove, className, children, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: cx("pui-tag", className), ...props, children: [
    children,
    onRemove && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "pui-tag__close", "aria-label": "Remove", onClick: onRemove, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(X, {}) })
  ] });
}
function Avatar({ name, src, size = "md", tone = "accent", status, className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "span",
    {
      className: cx("pui-avatar", className),
      "data-size": size,
      "data-tone": tone === "accent" ? void 0 : tone,
      title: name,
      ...props,
      children: [
        src ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("img", { src, alt: name }) : initials(name),
        status && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "pui-avatar__status", "data-status": status })
      ]
    }
  );
}
function AvatarGroup({ children, max, size = "md", className }) {
  const items = React4.Children.toArray(children);
  const shown = max ? items.slice(0, max) : items;
  const extra = max ? items.length - shown.length : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: cx("pui-avatar-group", className), children: [
    shown,
    extra > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "pui-avatar pui-avatar-group__more", "data-size": size, children: [
      "+",
      extra
    ] })
  ] });
}
function Card({ padded = true, className, children, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: cx("pui-card", padded && "pui-card--pad", className), ...props, children });
}
function StatCard({ label, value, delta, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: cx("pui-stat", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "pui-stat__label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "pui-stat__value", children: value }),
    delta && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "pui-stat__delta", "data-dir": delta.direction, children: [
      delta.direction === "up" ? "\u25B2" : "\u25BC",
      " ",
      delta.value
    ] })
  ] });
}
function Progress({ value, className, ...props }) {
  const indeterminate = value == null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "div",
    {
      className: cx("pui-progress", className),
      "data-indeterminate": indeterminate || void 0,
      role: "progressbar",
      "aria-valuenow": indeterminate ? void 0 : value,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "pui-progress__bar", style: indeterminate ? void 0 : { width: `${value}%` } })
    }
  );
}
function Spinner({ size = 30, className, style, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { role: "status", "aria-label": "Loading", className: cx("pui-spinner", className), style: { width: size, height: size, ...style }, ...props });
}
function Skeleton({ width, height = 11, className, style, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: cx("pui-skeleton", className), style: { width, height, ...style }, ...props });
}
function EmptyState({ icon, title, description, action, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: cx("pui-empty", className), children: [
    icon && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "pui-empty__icon", children: icon }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "pui-empty__title", children: title }),
    description && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "pui-empty__desc", children: description }),
    action && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { marginTop: 10 }, children: action })
  ] });
}

// src/components/Accordion.tsx
var React5 = __toESM(require("react"), 1);
var import_jsx_runtime6 = require("react/jsx-runtime");
var AccordionContext = React5.createContext(null);
function Accordion({ children, type = "single", defaultValue, className }) {
  const [open, setOpen] = React5.useState(
    defaultValue == null ? [] : Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  );
  const value = React5.useMemo(
    () => ({
      isOpen: (v) => open.includes(v),
      toggle: (v) => setOpen((prev) => {
        const has = prev.includes(v);
        if (type === "single") return has ? [] : [v];
        return has ? prev.filter((x) => x !== v) : [...prev, v];
      })
    }),
    [open, type]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: cx("pui-accordion", className), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(AccordionContext.Provider, { value, children }) });
}
function AccordionItem({ value, title, children }) {
  const ctx = React5.useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within <Accordion>");
  const open = ctx.isOpen(value);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "pui-accordion__item", "data-open": open || void 0, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "button",
      {
        type: "button",
        className: "pui-accordion__trigger",
        "aria-expanded": open,
        onClick: () => ctx.toggle(value),
        children: [
          title,
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ChevronDown, { className: "pui-accordion__chevron" })
        ]
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "pui-accordion__panel", children })
  ] });
}

// src/components/Tabs.tsx
var React6 = __toESM(require("react"), 1);
var import_jsx_runtime7 = require("react/jsx-runtime");
var TabsContext = React6.createContext(null);
function Tabs({ children, defaultValue, value, onValueChange, className }) {
  const [internal, setInternal] = React6.useState(defaultValue);
  const current = value ?? internal;
  const setValue = (v) => {
    if (value === void 0) setInternal(v);
    onValueChange?.(v);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TabsContext.Provider, { value: { value: current, setValue }, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className, children }) });
}
function useTabs(component) {
  const ctx = React6.useContext(TabsContext);
  if (!ctx) throw new Error(`${component} must be used within <Tabs>`);
  return ctx;
}
function TabList({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { role: "tablist", className: cx("pui-tabs__list", className), children });
}
function Tab({ value, children }) {
  const ctx = useTabs("Tab");
  const active = ctx.value === value;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": active,
      "data-active": active || void 0,
      className: "pui-tabs__tab",
      onClick: () => ctx.setValue(value),
      children
    }
  );
}
function TabPanel({ value, children, className }) {
  const ctx = useTabs("TabPanel");
  if (ctx.value !== value) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { role: "tabpanel", className: cx("pui-tabs__panel", className), children });
}

// src/components/Navigation.tsx
var React7 = __toESM(require("react"), 1);
var import_jsx_runtime8 = require("react/jsx-runtime");
function Breadcrumbs({ items, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("nav", { "aria-label": "Breadcrumb", className: cx("pui-breadcrumbs", className), children: items.map((c, i) => {
    const last = i === items.length - 1;
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(React7.Fragment, { children: [
      last || !c.href ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: last ? "pui-breadcrumbs__current" : void 0, "aria-current": last ? "page" : void 0, children: c.label }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("a", { href: c.href, children: c.label }),
      !last && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ChevronRight, { className: "pui-breadcrumbs__sep" })
    ] }, i);
  }) });
}
function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
function Pagination({ page, count, onChange, siblings = 1, className }) {
  const pages = React7.useMemo(() => {
    const total = count;
    const left = Math.max(2, page - siblings);
    const right = Math.min(total - 1, page + siblings);
    const out = [1];
    if (left > 2) out.push("\u2026");
    out.push(...range(left, right));
    if (right < total - 1) out.push("\u2026");
    if (total > 1) out.push(total);
    return out.filter((v, i, a) => v !== a[i - 1]);
  }, [page, count, siblings]);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("nav", { className: cx("pui-pagination", className), "aria-label": "Pagination", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("button", { className: "pui-pagination__btn", disabled: page <= 1, onClick: () => onChange(page - 1), children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ChevronLeft, {}),
      "Prev"
    ] }),
    pages.map(
      (p, i) => p === "\u2026" ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "pui-pagination__ellipsis", children: "\u2026" }, `e${i}`) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "button",
        {
          className: "pui-pagination__btn",
          "data-active": p === page || void 0,
          "aria-current": p === page ? "page" : void 0,
          onClick: () => onChange(p),
          children: p
        },
        p
      )
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("button", { className: "pui-pagination__btn", disabled: page >= count, onClick: () => onChange(page + 1), children: [
      "Next",
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ChevronRight, {})
    ] })
  ] });
}
function Segmented({ options, value, onValueChange, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: cx("pui-segmented", className), role: "tablist", children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": value === o.value,
      "data-active": value === o.value || void 0,
      className: "pui-segmented__btn",
      onClick: () => onValueChange(o.value),
      children: o.label
    },
    o.value
  )) });
}

// src/components/Table.tsx
var React8 = __toESM(require("react"), 1);
var import_jsx_runtime9 = require("react/jsx-runtime");
function Table({ columns, data, rowKey, className }) {
  const [sort, setSort] = React8.useState(null);
  const sorted = React8.useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return data;
    const next = [...data].sort((a, b) => {
      const va = col.sortValue(a);
      const vb = col.sortValue(b);
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return next;
  }, [data, columns, sort]);
  const onSort = (col) => {
    if (!col.sortable) return;
    setSort(
      (prev) => prev?.key === col.key ? { key: col.key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key: col.key, dir: "asc" }
    );
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: cx("pui-table-wrap", className), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("table", { className: "pui-table", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("tr", { children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "th",
      {
        "data-sortable": col.sortable || void 0,
        onClick: () => onSort(col),
        style: { width: col.width, textAlign: col.align },
        children: col.sortable ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "pui-table__sort", children: [
          col.header,
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Sort, { style: { width: 13, height: 13 } })
        ] }) : col.header
      },
      col.key
    )) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("tbody", { children: sorted.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("tr", { children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { style: { textAlign: col.align }, children: col.cell(row) }, col.key)) }, rowKey(row, i))) })
  ] }) });
}

// src/components/Alert.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
var ICONS = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: XCircle
};
function Alert({ tone = "info", title, onDismiss, className, children, ...props }) {
  const Icon = ICONS[tone];
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: cx("pui-alert", className), "data-tone": tone === "info" ? void 0 : tone, role: "alert", ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Icon, { className: "pui-alert__icon" }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: { flex: 1 }, children: [
      title && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "pui-alert__title", children: title }),
      children && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "pui-alert__body", children })
    ] }),
    onDismiss && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("button", { type: "button", className: "pui-alert__close", "aria-label": "Dismiss", onClick: onDismiss, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(X, { style: { width: 16, height: 16 } }) })
  ] });
}

// src/components/Toast.tsx
var React9 = __toESM(require("react"), 1);
var import_jsx_runtime11 = require("react/jsx-runtime");
var ToastContext = React9.createContext(null);
var ICONS2 = { info: Info, success: CheckCircle, danger: XCircle };
function ToastProvider({ children }) {
  const [items, setItems] = React9.useState([]);
  const timers = React9.useRef({});
  const dismiss = React9.useCallback((id) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);
  const toast = React9.useCallback(
    (opts) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, ...opts }]);
      const duration = opts.duration ?? 4500;
      if (duration > 0) timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );
  React9.useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(ToastContext.Provider, { value: { toast, dismiss }, children: [
    children,
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "pui-toast-region", role: "region", "aria-label": "Notifications", children: items.map((t) => {
      const Icon = ICONS2[t.tone ?? "info"];
      return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "pui-toast", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "pui-toast__icon", "data-tone": t.tone ?? "info", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Icon, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "pui-toast__title", children: t.title }),
          t.description && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "pui-toast__desc", children: t.description })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { className: "pui-toast__close", "aria-label": "Dismiss", onClick: () => dismiss(t.id), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(X, { style: { width: 15, height: 15 } }) })
      ] }, t.id);
    }) })
  ] });
}
function useToast() {
  const ctx = React9.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>");
  return ctx;
}

// src/components/Overlay.tsx
var React10 = __toESM(require("react"), 1);
var import_jsx_runtime12 = require("react/jsx-runtime");
function Tooltip({ label, children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { className: cx("pui-tooltip", className), children: [
    children,
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { role: "tooltip", className: "pui-tooltip__bubble", children: label })
  ] });
}
function useDismiss(open, onClose) {
  const ref = React10.useRef(null);
  React10.useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}
function DropdownMenu({ trigger, children, items, align = "start", className }) {
  const [open, setOpen] = React10.useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: cx("pui-menu", className), ref, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { onClick: () => setOpen((o) => !o), children: trigger }),
    open && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "pui-menu__panel", "data-align": align, role: "menu", children: items ? items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
      "button",
      {
        type: "button",
        role: "menuitem",
        className: "pui-menu__item",
        "data-tone": item.tone === "danger" ? "danger" : void 0,
        onClick: () => {
          item.onSelect?.();
          setOpen(false);
        },
        children: [
          item.icon,
          item.label
        ]
      },
      i
    )) : children })
  ] });
}
function MenuSeparator() {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "pui-menu__sep" });
}
function Modal({ open, onClose, title, children, footer, icon }) {
  React10.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "pui-overlay", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "pui-dialog", role: "dialog", "aria-modal": "true", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "pui-dialog__head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: { display: "flex", gap: 13, alignItems: "flex-start" }, children: [
        icon,
        title && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "pui-dialog__title", children: title })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("button", { type: "button", className: "pui-dialog__close", "aria-label": "Close", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(X, { style: { width: 20, height: 20 } }) })
    ] }),
    children && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "pui-dialog__body", children }),
    footer && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "pui-dialog__footer", children: footer })
  ] }) });
}

// src/components/Extras.tsx
var React11 = __toESM(require("react"), 1);
var import_jsx_runtime13 = require("react/jsx-runtime");
function Separator({ orientation = "horizontal", className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    "div",
    {
      role: "separator",
      "aria-orientation": orientation,
      "data-orientation": orientation,
      className: cx("pui-separator", className),
      ...props
    }
  );
}
function Kbd({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("kbd", { className: cx("pui-kbd", className), children });
}
function Link({ external, className, children, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    "a",
    {
      className: cx("pui-link", className),
      ...external ? { target: "_blank", rel: "noreferrer" } : {},
      ...props,
      children
    }
  );
}
function useDismiss2(open, onClose) {
  const ref = React11.useRef(null);
  React11.useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}
function Popover({ trigger, children, align = "start", className }) {
  const [open, setOpen] = React11.useState(false);
  const ref = useDismiss2(open, () => setOpen(false));
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cx("pui-menu", className), ref, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { onClick: () => setOpen((o) => !o), children: trigger }),
    open && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "pui-popover", "data-align": align, role: "dialog", children })
  ] });
}
function Drawer({ open, onClose, side = "right", title, children, footer }) {
  React11.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "pui-drawer-overlay", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "pui-drawer", "data-side": side, role: "dialog", "aria-modal": "true", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "pui-drawer__head", children: [
      title && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "pui-drawer__title", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("button", { type: "button", className: "pui-dialog__close", "aria-label": "Close", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(X, { style: { width: 20, height: 20 } }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "pui-drawer__body", children }),
    footer && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "pui-drawer__footer", children: footer })
  ] }) });
}
function ToggleGroup({ options, value, onValueChange, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: cx("pui-toggle-group", className), role: "group", children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    "button",
    {
      type: "button",
      "aria-pressed": value === o.value,
      "data-active": value === o.value || void 0,
      className: "pui-toggle",
      onClick: () => onValueChange(o.value),
      children: [
        o.icon,
        o.label
      ]
    },
    o.value
  )) });
}
function Stepper({ steps, current, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("ol", { className: cx("pui-stepper", className), children: steps.map((s, i) => {
    const state = i < current ? "done" : i === current ? "current" : "upcoming";
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("li", { className: "pui-step", "data-state": state, children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "pui-step__marker", children: i < current ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Check, {}) : i + 1 }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "pui-step__body", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "pui-step__label", children: s.label }),
        s.description && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "pui-step__desc", children: s.description })
      ] })
    ] }, i);
  }) });
}
function CodeBlock({ code, filename, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: cx("pui-code", className), children: [
    filename && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "pui-code__bar", children: filename }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("pre", { className: "pui-code__pre", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("code", { children: code }) })
  ] });
}
function List({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("ul", { className: cx("pui-list", className), children });
}
function ListItem({ children, className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("li", { className: cx("pui-list-item", className), ...props, children });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Accordion,
  AccordionItem,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  CodeBlock,
  Drawer,
  DropdownMenu,
  EmptyState,
  Field,
  Icons,
  Input,
  Kbd,
  Link,
  List,
  ListItem,
  MenuSeparator,
  Modal,
  Pagination,
  Popover,
  Progress,
  RadioGroup,
  SearchInput,
  Segmented,
  Select,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  StatCard,
  Stepper,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  Tag,
  Textarea,
  ThemeProvider,
  ThemeToggle,
  ToastProvider,
  ToggleGroup,
  Tooltip,
  cx,
  initials,
  useTheme,
  useToast
});
//# sourceMappingURL=index.cjs.map