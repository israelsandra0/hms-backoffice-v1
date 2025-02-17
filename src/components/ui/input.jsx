import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-8 w-full rounded border border-neutral-200 bg-[#F2F2F5] px-3 autofill:bg-[#F2F2F5] py-2 text-sm  file:border-0 file:bg-[#F2F2F5] file:text-sm file:font-medium file:text-neutral-950 placeholder:text-[#BBBAC5] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-[#F2F2F5] dark:ring-offset-neutral-950 outline-none text-black dark:file:text-neutral-50 dark:placeholder:text-neutral-400 ",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
