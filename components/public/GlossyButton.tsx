import Link from "next/link";
import type * as React from "react";

import { cn } from "@/lib/utils";

type GlossyVariant = "brand" | "dark" | "white";
type GlossySize = "sm" | "md" | "lg";

const VARIANT_CLASS: Record<GlossyVariant, string> = {
  brand: "",
  dark: "btn-glossy-dark",
  white: "btn-glossy-white",
};

const SIZE_CLASS: Record<GlossySize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type BaseProps = {
  variant?: GlossyVariant;
  size?: GlossySize;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

type AnchorProps = BaseProps &
  Omit<React.ComponentProps<typeof Link>, "className" | "children" | "style"> & {
    href: string;
  };

type ButtonProps = BaseProps &
  Omit<React.ComponentProps<"button">, "className" | "children" | "style"> & {
    href?: never;
  };

/**
 * The primary call to action. Renders a link when given an href and a button
 * otherwise, so it is never a div pretending to be interactive.
 *
 * To recolour it per product, pass the inline custom properties from
 * `glossyButtonVars(brandColor)` on `style`.
 */
export function GlossyButton(props: AnchorProps | ButtonProps) {
  const {
    variant = "brand",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    "btn-glossy inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className,
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as AnchorProps;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as ButtonProps;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
