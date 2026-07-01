import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-medium transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary";

export function Button({
  className,
  href,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: string }) {
  if (href) {
    return <Link className={cn(buttonClass, className)} href={href}>{props.children}</Link>;
  }

  return <button className={cn(buttonClass, className)} {...props} />;
}
