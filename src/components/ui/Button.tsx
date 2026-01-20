import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition " +
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-60 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary text-primary-fg hover:opacity-95 shadow-soft",
    secondary: "bg-muted text-fg hover:opacity-95 border border-border",
    ghost: "bg-transparent text-fg hover:bg-muted",
  };

  return <button className={cx(base, variants[variant], className)} {...props} />;
}
