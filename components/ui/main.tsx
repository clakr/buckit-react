import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export default function Main({
  children,
  className,
  ...rest
}: ComponentProps<"main">) {
  return (
    <main {...rest} className={cn("mx-auto max-w-screen-lg p-4", className)}>
      {children}
    </main>
  );
}
