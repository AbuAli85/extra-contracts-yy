import { FileText, FileCheck, FileX, CalendarClock, Users, Building } from "lucide-react"
import type {
  SummaryWidgetData,
  ContractReportItem,
  ReviewItem,
  NotificationItem,
  ContractsPerMonthData,
  ContractsByStatusData,
  ContractVolumeData,
} from "./dashboard-types"

export const summaryWidgetsData: SummaryWidgetData[] = [
  {
    title: "Total Contracts",
    titleAr: "إجمالي العقود",
    value: 1250,
    icon: FileText,
    trend: "+12%",
    color: "text-blue-500",
  },
  {
    title: "Active Contracts",
    titleAr: "العقود النشطة",
    value: 850,
    icon: FileCheck,
    trend: "+5%",
    color: "text-green-500",
  },
  {
    title: "Expired Contracts",
    titleAr: "العقود منتهية الصلاحية",
    value: 300,
    icon: FileX,
    trend: "-2%",
    color: "text-red-500",
  },
  {
    title: "Expiring in 30 Days",
    titleAr: "تنتهي خلال 30 يومًا",
    value: 75,
    icon: CalendarClock,
    trend: "+10",
    color: "text-orange-500",
  },
  { title: "Total Promoters", titleAr: "إجمالي المروجين", value: 250, icon: Users, color: "text-purple-500" },
  { title: "Total Companies", titleAr: "إجمالي الشركات", value: 150, icon: Building, color: "text-teal-500" },
]

export const contractReportsData: ContractReportItem[] = [
  {
    id: "1",
    contractId: "CON-001",
    promoterName: "Aisha Al Ahmed",
    employer: "Tech Solutions LLC",
    client: "Global Corp",
    startDate: "2023-01-15",
    endDate: "2024-01-14",
    status: "Expired",
  },
  {
    id: "2",
    contractId: "CON-002",
    promoterName: "John Doe",
    employer: "Innovate Ltd",
    client: "Alpha Inc",
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    status: "Active",
  },
  {
    id: "3",
    contractId: "CON-003",
    promoterName: "Fatima Khan",
    employer: "Creative Minds",
    client: "Beta Group",
    startDate: "2024-07-01",
    endDate: "2024-07-25",
    status: "Soon-to-Expire",
  },
  {
    id: "4",
    contractId: "CON-004",
    promoterName: "Omar Hassan",
    employer: "Tech Solutions LLC",
    client: "Gamma Co.",
    startDate: "2024-03-10",
    endDate: "2025-03-09",
    status: "Active",
  },
]

export const recentlyCreatedContracts: ReviewItem[] = [
  {
    id: "rc1",
    title: "CON-004",
    promoter: "Omar Hassan",
    parties: "Tech Solutions LLC / Gamma Co.",
    period: "Mar 10, 2024 - Mar 09, 2025",
    contractLink: "/contracts/CON-004",
  },
  {
    id: "rc2",
    title: "CON-005",
    promoter: "Li Wei",
    parties: "Innovate Ltd / Delta LLC",
    period: "Apr 01, 2024 - Mar 31, 2025",
    contractLink: "/contracts/CON-005",
  },
]

export const recentlyExpiredContracts: ReviewItem[] = [
  {
    id: "re1",
    title: "CON-001",
    promoter: "Aisha Al Ahmed",
    parties: "Tech Solutions LLC / Global Corp",
    period: "Jan 15, 2023 - Jan 14, 2024",
    contractLink: "/contracts/CON-001",
  },
]

export const contractsMissingDocuments: ReviewItem[] = [
  {
    id: "md1",
    title: "CON-002",
    promoter: "John Doe",
    parties: "Innovate Ltd / Alpha Inc",
    period: "Jun 01, 2023 - May 31, 2024",
    contractLink: "/contracts/CON-002",
  },
]

export const notificationItemsData: NotificationItem[] = [
  {
    id: "n1",
    contractId: "CON-003",
    promoterName: "Fatima Khan",
    clientName: "Beta Group",
    daysUntilExpiry: 20,
    expiryDate: "2024-07-25",
  },
  {
    id: "n2",
    contractId: "CON-006",
    promoterName: "Maria Garcia",
    clientName: "Epsilon Solutions",
    daysUntilExpiry: 28,
    expiryDate: "2024-08-02",
  },
]

export const contractsPerMonthChartData: ContractsPerMonthData[] = [
  { month: "Jan", contracts: 65 },
  { month: "Feb", contracts: 59 },
  { month: "Mar", contracts: 80 },
  { month: "Apr", contracts: 81 },
  { month: "May", contracts: 56 },
  { month: "Jun", contracts: 55 },
  { month: "Jul", contracts: 40 },
  { month: "Aug", contracts: 70 },
  { month: "Sep", contracts: 60 },
  { month: "Oct", contracts: 90 },
  { month: "Nov", contracts: 75 },
  { month: "Dec", contracts: 85 },
]

export const contractsByStatusChartData: ContractsByStatusData[] = [
  { name: "Active", value: 850, fill: "hsl(var(--chart-1))" },
  { name: "Expired", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "Soon-to-Expire", value: 75, fill: "hsl(var(--chart-3))" },
]

export const contractVolumeTrendData: ContractVolumeData[] = Array.from({ length: 12 }, (_, i) => {
  const date = new Date()
  date.setMonth(date.getMonth() - (11 - i))
  return {
    month: date.toLocaleString("default", { month: "short" }),
    volume: Math.floor(Math.random() * 50) + 50, // Random volume between 50-100
  }
})
