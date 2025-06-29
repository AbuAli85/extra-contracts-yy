"use client"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Area,
  AreaChart,
  Dot,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts"
import {
  ChartContainer as BaseChartContainer,
  ChartTooltip as BaseChartTooltip,
  ChartTooltipContent as BaseChartTooltipContent,
} from "@/components/ui/chart" // Assuming chart.tsx is in components/ui

// Re-exporting the base components
export {
  BaseChartContainer as ChartContainer,
  BaseChartTooltip as ChartTooltip,
  BaseChartTooltipContent as ChartTooltipContent,
}

// Re-exporting Recharts components for composition
export {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Area,
  AreaChart,
  Dot,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  RechartsTooltip as Tooltip, // Renamed to avoid conflict with shadcn/ui ChartTooltip
}

// Default export (if needed, otherwise remove)
const Chart = () => null // Placeholder for a default export if the file is meant to be a module with a default export
export default Chart
