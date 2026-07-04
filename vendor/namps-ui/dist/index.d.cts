import * as React from 'react';

type Theme = "light" | "dark";
interface ThemeContextValue {
    theme: Theme;
    setTheme: (t: Theme) => void;
    toggle: () => void;
}
interface ThemeProviderProps {
    children: React.ReactNode;
    /** Initial theme when nothing is stored. Default "light". */
    defaultTheme?: Theme;
    /** localStorage key for persistence. Default "pui-theme". Pass null to disable. */
    storageKey?: string | null;
    /** Element to stamp `data-theme` on. Default document.documentElement. */
    attributeTarget?: "html" | "self";
}
/**
 * Wrap your app once. Sets `data-theme` on <html> (or a wrapper div) and
 * persists the choice. Read/control via the `useTheme()` hook.
 */
declare function ThemeProvider({ children, defaultTheme, storageKey, attributeTarget, }: ThemeProviderProps): React.JSX.Element;
declare function useTheme(): ThemeContextValue;
/** Drop-in icon button that flips the theme. */
declare function ThemeToggle({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element;

/** Tiny classNames helper — joins truthy class fragments. */
declare function cx(...parts: Array<string | false | null | undefined>): string;
/** Derive up-to-two-letter initials from a full name. */
declare function initials(name: string): string;

type IconProps = React.SVGProps<SVGSVGElement>;
declare const ChevronDown: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const ChevronRight: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const ChevronLeft: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const Check: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const X: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const Search: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const Plus: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const Sun: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const Moon: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const Info: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const AlertTriangle: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const CheckCircle: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const XCircle: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const ArrowRight: ({ className, ...props }: IconProps) => React.JSX.Element;
declare const Sort: ({ className, ...props }: IconProps) => React.JSX.Element;
declare function DotsVertical({ className, ...props }: IconProps): React.JSX.Element;

declare const icons_AlertTriangle: typeof AlertTriangle;
declare const icons_ArrowRight: typeof ArrowRight;
declare const icons_Check: typeof Check;
declare const icons_CheckCircle: typeof CheckCircle;
declare const icons_ChevronDown: typeof ChevronDown;
declare const icons_ChevronLeft: typeof ChevronLeft;
declare const icons_ChevronRight: typeof ChevronRight;
declare const icons_DotsVertical: typeof DotsVertical;
declare const icons_Info: typeof Info;
declare const icons_Moon: typeof Moon;
declare const icons_Plus: typeof Plus;
declare const icons_Search: typeof Search;
declare const icons_Sort: typeof Sort;
declare const icons_Sun: typeof Sun;
declare const icons_X: typeof X;
declare const icons_XCircle: typeof XCircle;
declare namespace icons {
  export { icons_AlertTriangle as AlertTriangle, icons_ArrowRight as ArrowRight, icons_Check as Check, icons_CheckCircle as CheckCircle, icons_ChevronDown as ChevronDown, icons_ChevronLeft as ChevronLeft, icons_ChevronRight as ChevronRight, icons_DotsVertical as DotsVertical, icons_Info as Info, icons_Moon as Moon, icons_Plus as Plus, icons_Search as Search, icons_Sort as Sort, icons_Sun as Sun, icons_X as X, icons_XCircle as XCircle };
}

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Renders a spinner and disables the button. */
    loading?: boolean;
    /** Icon-only square button. Pass an icon as the single child. */
    iconOnly?: boolean;
    /** Stretch to full container width. */
    block?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}
/**
 * The primary action element. Five variants, three sizes, loading + icon support.
 *
 * @example
 * <Button variant="primary" leftIcon={<Plus/>}>Create key</Button>
 */
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

interface FieldProps {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    htmlFor?: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
/** Labelled wrapper: renders label, control, and hint/error text. */
declare function Field({ label, hint, error, htmlFor, children, className, style }: FieldProps): React.JSX.Element;
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    invalid?: boolean;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
/** Input with a leading search glyph. */
declare const SearchInput: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    invalid?: boolean;
}
declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options?: Array<{
        label: string;
        value: string;
    }>;
}
declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: React.ReactNode;
}
declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
}
declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLInputElement>>;
interface RadioOption {
    value: string;
    title: React.ReactNode;
    description?: React.ReactNode;
}
interface RadioGroupProps {
    name: string;
    value: string;
    onValueChange: (value: string) => void;
    options: RadioOption[];
    className?: string;
}
/** Card-style radio group. Controlled via `value` / `onValueChange`. */
declare function RadioGroup({ name, value, onValueChange, options, className }: RadioGroupProps): React.JSX.Element;
interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
    value: number;
    min?: number;
    max?: number;
    onValueChange: (value: number) => void;
}
declare function Slider({ value, min, max, onValueChange, className, ...props }: SliderProps): React.JSX.Element;

type Tone = "neutral" | "green" | "amber" | "red" | "blue" | "accent";
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    tone?: Tone;
    solid?: boolean;
    dot?: boolean;
}
declare function Badge({ tone, solid, dot, className, children, ...props }: BadgeProps): React.JSX.Element;
interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    onRemove?: () => void;
}
declare function Tag({ onRemove, className, children, ...props }: TagProps): React.JSX.Element;
type AvatarSize = "sm" | "md" | "lg";
interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
    name: string;
    src?: string;
    size?: AvatarSize;
    tone?: "accent" | "blue" | "green" | "amber";
    status?: "online" | "busy" | "away";
}
declare function Avatar({ name, src, size, tone, status, className, ...props }: AvatarProps): React.JSX.Element;
interface AvatarGroupProps {
    /** Avatar elements. */
    children: React.ReactNode;
    /** Show at most this many, collapsing the rest into a "+N". */
    max?: number;
    size?: AvatarSize;
    className?: string;
}
declare function AvatarGroup({ children, max, size, className }: AvatarGroupProps): React.JSX.Element;
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    padded?: boolean;
}
declare function Card({ padded, className, children, ...props }: CardProps): React.JSX.Element;
interface StatCardProps {
    label: React.ReactNode;
    value: React.ReactNode;
    delta?: {
        value: React.ReactNode;
        direction: "up" | "down";
    };
    className?: string;
}
declare function StatCard({ label, value, delta, className }: StatCardProps): React.JSX.Element;
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 0–100. Omit for an indeterminate bar. */
    value?: number;
}
declare function Progress({ value, className, ...props }: ProgressProps): React.JSX.Element;
declare function Spinner({ size, className, style, ...props }: {
    size?: number;
} & React.HTMLAttributes<HTMLSpanElement>): React.JSX.Element;
declare function Skeleton({ width, height, className, style, ...props }: {
    width?: number | string;
    height?: number | string;
} & React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}
declare function EmptyState({ icon, title, description, action, className }: EmptyStateProps): React.JSX.Element;

interface AccordionProps {
    children: React.ReactNode;
    /** "single" (default) collapses others; "multiple" allows many open. */
    type?: "single" | "multiple";
    defaultValue?: string | string[];
    className?: string;
}
/**
 * Collapsible disclosure list.
 * @example
 * <Accordion defaultValue="a">
 *   <AccordionItem value="a" title="How is usage metered?">…</AccordionItem>
 *   <AccordionItem value="b" title="Can I rotate keys?">…</AccordionItem>
 * </Accordion>
 */
declare function Accordion({ children, type, defaultValue, className }: AccordionProps): React.JSX.Element;
interface AccordionItemProps {
    value: string;
    title: React.ReactNode;
    children: React.ReactNode;
}
declare function AccordionItem({ value, title, children }: AccordionItemProps): React.JSX.Element;

interface TabsProps {
    children: React.ReactNode;
    defaultValue: string;
    value?: string;
    onValueChange?: (v: string) => void;
    className?: string;
}
/**
 * Underline tab set.
 * @example
 * <Tabs defaultValue="overview">
 *   <TabList>
 *     <Tab value="overview">Overview</Tab>
 *     <Tab value="activity">Activity</Tab>
 *   </TabList>
 *   <TabPanel value="overview">…</TabPanel>
 *   <TabPanel value="activity">…</TabPanel>
 * </Tabs>
 */
declare function Tabs({ children, defaultValue, value, onValueChange, className }: TabsProps): React.JSX.Element;
declare function TabList({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
declare function Tab({ value, children }: {
    value: string;
    children: React.ReactNode;
}): React.JSX.Element;
declare function TabPanel({ value, children, className }: {
    value: string;
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element | null;

interface Crumb {
    label: React.ReactNode;
    href?: string;
}
declare function Breadcrumbs({ items, className }: {
    items: Crumb[];
    className?: string;
}): React.JSX.Element;
interface PaginationProps {
    page: number;
    count: number;
    onChange: (page: number) => void;
    /** How many sibling pages to show around the current one. Default 1. */
    siblings?: number;
    className?: string;
}
declare function Pagination({ page, count, onChange, siblings, className }: PaginationProps): React.JSX.Element;
interface SegmentedProps {
    options: Array<{
        label: React.ReactNode;
        value: string;
    }>;
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}
declare function Segmented({ options, value, onValueChange, className }: SegmentedProps): React.JSX.Element;

interface Column<T> {
    key: string;
    header: React.ReactNode;
    /** Cell renderer. Receives the row. */
    cell: (row: T) => React.ReactNode;
    sortable?: boolean;
    /** Comparator used when this column is sorted. */
    sortValue?: (row: T) => string | number;
    width?: string;
    align?: "left" | "right" | "center";
}
interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    rowKey: (row: T, index: number) => React.Key;
    className?: string;
}
/**
 * Data-driven table with optional client-side sorting.
 * @example
 * <Table rowKey={(r) => r.id} data={members} columns={[
 *   { key: "name", header: "Member", cell: (r) => r.name, sortable: true, sortValue: (r) => r.name },
 *   { key: "role", header: "Role", cell: (r) => r.role },
 * ]} />
 */
declare function Table<T>({ columns, data, rowKey, className }: TableProps<T>): React.JSX.Element;

type AlertTone = "info" | "success" | "warning" | "danger";
interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    tone?: AlertTone;
    title?: React.ReactNode;
    onDismiss?: () => void;
}
/** Inline banner for four intents. */
declare function Alert({ tone, title, onDismiss, className, children, ...props }: AlertProps): React.JSX.Element;

type ToastTone = "info" | "success" | "danger";
interface ToastOptions {
    title: React.ReactNode;
    description?: React.ReactNode;
    tone?: ToastTone;
    /** Auto-dismiss after this many ms. Default 4500. 0 = sticky. */
    duration?: number;
}
interface ToastContextValue {
    toast: (opts: ToastOptions) => number;
    dismiss: (id: number) => void;
}
/** Wrap your app once; call notifications with the `useToast()` hook. */
declare function ToastProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
declare function useToast(): ToastContextValue;

interface TooltipProps {
    label: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}
/** Hover/focus tooltip. Wraps a single focusable child. */
declare function Tooltip({ label, children, className }: TooltipProps): React.JSX.Element;
interface MenuItem {
    label: React.ReactNode;
    icon?: React.ReactNode;
    onSelect?: () => void;
    tone?: "default" | "danger";
}
interface DropdownMenuProps {
    trigger: React.ReactNode;
    children?: React.ReactNode;
    items?: MenuItem[];
    align?: "start" | "end";
    className?: string;
}
/**
 * Click-to-open menu. Provide `items` for a simple list, or `children`
 * for custom content. Closes on outside click and Escape.
 */
declare function DropdownMenu({ trigger, children, items, align, className }: DropdownMenuProps): React.JSX.Element;
declare function MenuSeparator(): React.JSX.Element;
interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    /** Decorative icon shown beside the title. */
    icon?: React.ReactNode;
}
/** Overlay dialog. Closes on backdrop click and Escape. */
declare function Modal({ open, onClose, title, children, footer, icon }: ModalProps): React.JSX.Element | null;

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
}
declare function Separator({ orientation, className, ...props }: SeparatorProps): React.JSX.Element;
declare function Kbd({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    external?: boolean;
}
declare function Link({ external, className, children, ...props }: LinkProps): React.JSX.Element;
interface PopoverProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: "start" | "end";
    className?: string;
}
declare function Popover({ trigger, children, align, className }: PopoverProps): React.JSX.Element;
interface DrawerProps {
    open: boolean;
    onClose: () => void;
    side?: "left" | "right";
    title?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
}
declare function Drawer({ open, onClose, side, title, children, footer }: DrawerProps): React.JSX.Element | null;
interface ToggleOption {
    value: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
}
interface ToggleGroupProps {
    options: ToggleOption[];
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}
declare function ToggleGroup({ options, value, onValueChange, className }: ToggleGroupProps): React.JSX.Element;
interface Step {
    label: React.ReactNode;
    description?: React.ReactNode;
}
interface StepperProps {
    steps: Step[];
    /** Zero-based index of the active step. Earlier steps render as complete. */
    current: number;
    className?: string;
}
declare function Stepper({ steps, current, className }: StepperProps): React.JSX.Element;
interface CodeBlockProps {
    code: string;
    filename?: React.ReactNode;
    className?: string;
}
declare function CodeBlock({ code, filename, className }: CodeBlockProps): React.JSX.Element;
declare function List({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
declare function ListItem({ children, className, ...props }: React.LiHTMLAttributes<HTMLLIElement>): React.JSX.Element;

export { Accordion, AccordionItem, type AccordionItemProps, type AccordionProps, Alert, type AlertProps, type AlertTone, Avatar, AvatarGroup, type AvatarGroupProps, type AvatarProps, type AvatarSize, Badge, type BadgeProps, Breadcrumbs, Button, type ButtonProps, type ButtonSize, type ButtonVariant, Card, type CardProps, Checkbox, type CheckboxProps, CodeBlock, type CodeBlockProps, type Column, type Crumb, Drawer, type DrawerProps, DropdownMenu, type DropdownMenuProps, EmptyState, type EmptyStateProps, Field, type FieldProps, icons as Icons, Input, type InputProps, Kbd, Link, type LinkProps, List, ListItem, type MenuItem, MenuSeparator, Modal, type ModalProps, Pagination, type PaginationProps, Popover, type PopoverProps, Progress, type ProgressProps, RadioGroup, type RadioGroupProps, type RadioOption, SearchInput, Segmented, type SegmentedProps, Select, type SelectProps, Separator, type SeparatorProps, Skeleton, Slider, type SliderProps, Spinner, StatCard, type StatCardProps, type Step, Stepper, type StepperProps, Switch, type SwitchProps, Tab, TabList, TabPanel, Table, type TableProps, Tabs, type TabsProps, Tag, type TagProps, Textarea, type TextareaProps, type Theme, ThemeProvider, type ThemeProviderProps, ThemeToggle, type ToastOptions, ToastProvider, type ToastTone, ToggleGroup, type ToggleGroupProps, type ToggleOption, type Tone, Tooltip, type TooltipProps, cx, initials, useTheme, useToast };
