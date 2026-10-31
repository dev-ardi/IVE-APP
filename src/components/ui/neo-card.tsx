import { cn } from "@/lib/utils";

type NeoCardVariant = "default" | "lg" | "soft";

interface NeoCardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: NeoCardVariant;
  /** Render as a different HTML element (default: "div") */
  as?: React.ElementType;
  children: React.ReactNode;
}

const variantClasses: Record<NeoCardVariant, string> = {
  default: "neo-card",
  lg: "neo-card-lg",
  soft: "neo-card-soft",
};

export function NeoCard({
  variant = "default",
  as: Tag = "div",
  className,
  children,
  ...props
}: NeoCardProps) {
  return (
    <Tag className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Tag>
  );
}
