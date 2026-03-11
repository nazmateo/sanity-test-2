import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface BlockSlotProps extends HTMLAttributes<HTMLDivElement> {
  refId?: string;
  unstyled?: boolean;
}

export const BlockSlot = forwardRef<HTMLDivElement, BlockSlotProps>(
  ({ className, refId, children, unstyled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(unstyled ? undefined : 'rounded border p-3', className)}
        data-ref-id={refId}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BlockSlot.displayName = "BlockSlot";
