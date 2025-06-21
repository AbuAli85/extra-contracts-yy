// app/[locale]/page.tsx (Example - assuming your homepage is at the root)
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileTextIcon, FilePlus2Icon, History, UsersIcon, BuildingIcon, ExternalLinkIcon } from "lucide-react"
import AuthStatus from "@/components/auth-status" // Assuming this component exists
import { motion, type Variants, type Easing } from "framer-motion"

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1] as Easing,
    },
  }),
}

const actions = [
  {
    title: "Generate New Contract",
    description: "Create a new bilingual contract from scratch.",
    href: "/generate-contract",
    icon: FilePlus2Icon,
    variant: "default" as const,
  },
  {
    title: "View Contract History",
    description: "Review past contracts and their statuses.",
    href: "/contracts",
    icon: History,
    variant: "secondary" as const,
  },
  {
    title: "Manage Promoters",
    description: "Add, edit, or remove promoter profiles.",
    href: "/manage-promoters",
    icon: UsersIcon,
    variant: "outline" as const,
  },
  {
    title: "Manage Parties",
    description: "Maintain details of contracting parties.",
    href: "/manage-parties",
    icon: BuildingIcon,
    variant: "outline" as const,
  },
  {
    title: "Request New Contract (Manual)",
    description: "Submit a request using a detailed form.",
    href: "/generate-contract",
    icon: FileTextIcon,
    variant: "outline" as const,
  },
  {
    title: "View Static HTML Form",
    description: "Access the Make.com integrated form.",
    hrefExternal: "/index.html",
    icon: ExternalLinkIcon,
    variant: "outline" as const,
  },
]

export default function HomePage({ params }: { params: { locale: string } }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Bilingual Contract Management</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Streamline your contract creation and management process with our intuitive platform. Choose an action below
          to get started.
        </p>
      </motion.div>
      <AuthStatus /> {/* Assuming this shows login/logout status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }} // Tailwind shadow
            className="h-full"
          >
            <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-card-hover">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-x-3 mb-2">
                  {" "}
                  {/* RTL: gap-x-3 */}
                  <action.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl font-semibold font-heading">{action.title}</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground min-h-[40px]">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                {action.hrefExternal ? (
                  <a href={action.hrefExternal} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant={action.variant} className="w-full h-12 text-base font-semibold">
                      {action.title}
                      <ExternalLinkIcon className="ms-2 h-4 w-4" /> {/* RTL: me-2 */}
                    </Button>
                  </a>
                ) : (
                  <Button asChild variant={action.variant} className="w-full h-12 text-base font-semibold">
                    <Link href={`/${params.locale}${action.href}`}>{action.title}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
