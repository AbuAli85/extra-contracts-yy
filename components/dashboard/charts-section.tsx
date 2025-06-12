"use client"
// No changes from the previous version, assuming RPC functions and real-time on 'contracts' table are correctly set up.
// The RPC functions `get_contract_status_counts` and `get_monthly_contract_revenue`
// will query the base `contracts` table, which is what we want for aggregated chart data.
// The real-time subscription on `contracts` table will trigger refetch of these RPCs.
import { useEffect, useState } from "react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface ContractStatusData {
  name: string
  nameAr: string
  count: number
}
interface MonthlyRevenueData {
  month: string
  monthAr: string
  contracts: number
  revenue: number
}

const chartConfig = {
  contracts: { label: "Contracts", labelAr: "العقود", color: "hsl(var(--chart-1))" },
  revenue: { label: "Revenue ($)", labelAr: "الإيرادات ($)", color: "hsl(var(--chart-2))" },
  Active: { label: "Active", labelAr: "نشط", color: "hsl(var(--chart-1))" },
  Pending: { label: "Pending", labelAr: "قيد الانتظار", color: "hsl(var(--chart-3))" }, // Assuming Pending is a status
  Expired: { label: "Expired", labelAr: "منتهي الصلاحية", color: "hsl(var(--chart-2))" },
  Draft: { label: "Draft", labelAr: "مسودة", color: "hsl(var(--chart-4))" },
  "Soon-to-Expire": { label: "Soon to Expire", labelAr: "قريب الانتهاء", color: "hsl(var(--chart-5))" }, // Added
} satisfies Record<string, { label: string; labelAr: string; color: string }>

export default function ChartsSection() {
  const [statusData, setStatusData] = useState<ContractStatusData[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyRevenueData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchChartData = async () => {
    setLoading(true)
    try {
      const { data: statusResult, error: statusError } = await supabase.rpc("get_contract_status_counts")
      if (statusError) throw statusError
      setStatusData(
        statusResult.map((s: any) => ({
          ...s,
          nameAr: chartConfig[s.name as keyof typeof chartConfig]?.labelAr || s.name,
        })),
      )

      const { data: monthlyResult, error: monthlyError } = await supabase.rpc("get_monthly_contract_revenue")
      if (monthlyError) throw monthlyError
      setMonthlyData(monthlyResult.map((m: any) => ({ ...m, monthAr: m.month /* TODO: Arabic month name */ })))
    } catch (error: any) {
      console.error("Error fetching chart data:", error)
      toast({ title: "Error Fetching Chart Data", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChartData()

    const contractsChartChannel = supabase
      .channel("public:contracts:charts")
      .on("postgres_changes", { event: "*", schema: "public", table: "contracts" }, () => {
        toast({ title: "Chart Data Updating...", description: "Real-time contract changes detected." })
        fetchChartData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(contractsChartChannel)
    }
  }, [toast])

  if (loading) {
    return (
      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Contracts by Status / العقود حسب الحالة</CardTitle>
          <CardDescription>
            Distribution of contracts by their current status. / توزيع العقود حسب حالتها الراهنة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={100} // Adjusted width for potentially longer labels
                  tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                <Bar dataKey="count" radius={5}>
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartConfig[entry.name as keyof typeof chartConfig]?.color || chartConfig.Draft.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Contracts & Revenue / العقود والإيرادات الشهرية</CardTitle>
          <CardDescription>
            Track contract volume and revenue generation over time. / تتبع حجم العقود وتوليد الإيرادات بمرور الوقت.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" stroke="var(--color-contracts)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--color-revenue)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="contracts"
                  stroke="var(--color-contracts)"
                  name={chartConfig.contracts.label}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  name={chartConfig.revenue.label}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  )
}
