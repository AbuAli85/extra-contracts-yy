"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme" // Import useTheme hook

// Format: { THEME_NAME: { color: CSS_COLOR_VALUE, ... } }
const CHART_COLORS = {
  light: {
    grid: "hsl(210 40% 96.1%)",
    tooltip: "hsl(210 40% 96.1%)",
    label: "hsl(215.4 16.3% 46.9%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",
    primary: "hsl(222.2 47.4% 11.2%)",
    secondary: "hsl(210 40% 96.1%)",
    muted: "hsl(210 40% 96.1%)",
    "muted-foreground": "hsl(215.4 16.3% 46.9%)",
    red: "hsl(0 72% 51%)",
    blue: "hsl(217.2 91.2% 59.8%)",
    green: "hsl(142.1 76.2% 36.3%)",
    orange: "hsl(27.9 95.3% 59.4%)",
    yellow: "hsl(47.9 95.8% 53.1%)",
    purple: "hsl(262.1 83.3% 57.8%)",
    pink: "hsl(340.5 82.9% 76.2%)",
    cyan: "hsl(185.5 91.7% 40.7%)",
  },
  dark: {
    grid: "hsl(217.2 32.6% 17.5%)",
    tooltip: "hsl(217.2 32.6% 17.5%)",
    label: "hsl(215 20.2% 65.1%)",
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 96.1%)",
    primary: "hsl(210 40% 96.1%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    muted: "hsl(217.2 32.6% 17.5%)",
    "muted-foreground": "hsl(215 20.2% 65.1%)",
    red: "hsl(0 72% 51%)",
    blue: "hsl(217.2 91.2% 59.8%)",
    green: "hsl(142.1 76.2% 36.3%)",
    orange: "hsl(27.9 95.3% 59.4%)",
    yellow: "hsl(47.9 95.8% 53.1%)",
    purple: "hsl(262.1 83.3% 57.8%)",
    pink: "hsl(340.5 82.9% 76.2%)",
    cyan: "hsl(185.5 91.7% 40.7%)",
  },
}

type ChartContextProps = {
  config: Record<string, { color: string; label?: string }>
  /**
   * The <ChartContainer /> component sets a `--color-grid` variable for the
   * grid lines. This is useful for when you want to use a different color for
   * the grid lines than the default `border` color.
   *
   * @default "border"
   */
  grid?: string
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

type ChartContainerProps = {
  config: ChartContextProps["config"]
  children: React.ReactNode
  className?: string
  /**
   * The <ChartContainer /> component sets a `--color-grid` variable for the
   * grid lines. This is useful for when you want to use a different color for
   * the grid lines than the default `border` color.
   *
   * @default "border"
   */
  grid?: string
} & React.ComponentPropsWithoutRef<"div">

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, className, children, grid, ...props }, ref) => {
    const id = React.useId()
    const { theme } = useTheme() // Declare useTheme variable
    const chartColors = CHART_COLORS[theme as keyof typeof CHART_COLORS] || CHART_COLORS.light

    return (
      <ChartContext.Provider value={{ config, grid }}>
        <div
          ref={ref}
          className={cn(
            "flex h-[--chart-height] w-full flex-col [&_.recharts-cartesian-grid-item]:fill-border",
            className,
          )}
          style={
            {
              "--color-grid": grid ? `hsl(${chartColors[grid as keyof typeof chartColors]})` : chartColors.grid,
              "--chart-height": "200px",
              ...Object.entries(config)
                .map(([key, value]) => ({
                  [`--color-${key}`]: `hsl(${chartColors[value.color as keyof typeof chartColors] || value.color})`,
                }))
                .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
            } as React.CSSProperties
          }
          {...props}
        >
          <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<HTMLDivElement, RechartsPrimitive.TooltipProps>(
  ({ active, payload, className, ...props }, ref) => {
    const { config } = useChart()

    if (active && payload && payload.length) {
      return (
        <div
          ref={ref}
          className={cn(
            "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
            className,
          )}
          {...props}
        >
          {props.label && <div className="text-muted-foreground">{props.label}</div>}
          <div className="grid gap-1">
            {payload.map((item) => {
              const key = item.dataKey as keyof typeof config

              return (
                <div key={item.dataKey} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config[key]?.label || item.name}
                  </div>
                  {item.value && (
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return null
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }
