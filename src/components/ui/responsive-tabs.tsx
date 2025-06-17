
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const ResponsiveTabs = TabsPrimitive.Root

interface ResponsiveTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const ResponsiveTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  ResponsiveTabsListProps
>(({ className, children, value, onValueChange, ...props }, ref) => {
  const tabTriggers = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement[];

  return (
    <>
      {/* Mobile select for small screens */}
      <div className="sm:hidden mb-2">
        <select
          className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={value}
          onChange={e => onValueChange?.(e.target.value)}
        >
          {tabTriggers.map((trigger, idx) => (
            <option key={trigger.props.value || idx} value={trigger.props.value}>
              {trigger.props.children}
            </option>
          ))}
        </select>
      </div>
      {/* Desktop tabs for larger screens */}
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "hidden sm:inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full overflow-x-auto",
          className
        )}
        {...props}
      >
        <div className="flex space-x-1 min-w-full">
          {children}
        </div>
      </TabsPrimitive.List>
    </>
  );
})
ResponsiveTabsList.displayName = "ResponsiveTabsList"

const ResponsiveTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-shrink-0",
      className
    )}
    {...props}
  />
))
ResponsiveTabsTrigger.displayName = "ResponsiveTabsTrigger"

const ResponsiveTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
ResponsiveTabsContent.displayName = "ResponsiveTabsContent"

export { ResponsiveTabs, ResponsiveTabsList, ResponsiveTabsTrigger, ResponsiveTabsContent }
