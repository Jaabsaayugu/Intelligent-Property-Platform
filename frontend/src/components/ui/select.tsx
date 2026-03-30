"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select data-slot="select" {...props} />;
}

function SelectGroup(props: React.OptgroupHTMLAttributes<HTMLOptGroupElement>) {
  return <optgroup data-slot="select-group" {...props} />;
}

function SelectValue({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span data-slot="select-value" className={className} {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      data-slot="select-trigger"
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

function SelectContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="select-content" className={className} {...props} />;
}

function SelectLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function SelectItem(props: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return <option data-slot="select-item" {...props} />;
}

function SelectSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return <button data-slot="select-scroll-up-button" type="button" {...props} />;
}

function SelectScrollDownButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button data-slot="select-scroll-down-button" type="button" {...props} />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
