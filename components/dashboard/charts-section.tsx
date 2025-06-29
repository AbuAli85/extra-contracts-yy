"use client"

import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  Legend,
} from "recharts"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

interface ChartData {
  name: string
  value: number
}

interface BarChartProps {
  data: ChartData[]
}

interface PieChartProps {
  data: ChartData[]
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function BarChart({ data }: BarChartProps) {
  const { theme } = useTheme()
  const t = useTranslations("DashboardCharts")

  const chartConfig = {
    value: {
      label: t("count"),
      color: theme === "dark" ? "hsl(var(--primary))" : "hsl(var(--primary))",
    },
  } as const

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">{payload[0].name}</span>
                      <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="value" fill={chartConfig.value.color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function PieChart({ data }: PieChartProps) {
  const t = useTranslations("DashboardCharts")

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">{payload[0].name}</span>
                      <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

// This is the main component that uses the charts
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ContractsByMonth, ContractsByStatus } from "@/lib/dashboard-types"

interface ChartsSectionProps {
  contractsByStatus: ContractsByStatus[]
  contractsByMonth: ContractsByMonth[]
}

export function ChartsSection({ contractsByStatus, contractsByMonth }: ChartsSectionProps) {
  const t = useTranslations("DashboardChartsSection")

  // Transform data for BarChart and PieChart if necessary
  const barChartData = contractsByMonth.map((item) => ({ name: item.month, value: item.count }))
  const pieChartData = contractsByStatus.map((item) => ({ name: item.status, value: item.count }))

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("contractsByStatus")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart data={pieChartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("contractsOverTime")}</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={barChartData} />
        </CardContent>
      </Card>
    </div>
  )
}
