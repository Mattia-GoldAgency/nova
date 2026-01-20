import React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm " +
          "outline-none transition focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg " +
          "placeholder:text-muted-fg",
        className
      )}
      {...props}
    />
  );
}
