import * as React from "react";
import LinkPrimatives from "next/link";

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  redirectType?: "hard" | "soft";
  href: string;
}

const LinkIntercept = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, redirectType = "soft", href, ...props }, ref) => {
    const Comp = redirectType === "soft" ? LinkPrimatives : "a";

    return (
      <Comp href={href} ref={ref} {...props}>
        {children}
      </Comp>
    );
  },
);

LinkIntercept.displayName = "LinkIntercept";

export { LinkIntercept };