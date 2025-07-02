"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileTextIcon,
  FilePlus2Icon,
  History,
  UsersIcon,
  BuildingIcon,
  ExternalLinkIcon,
} from "lucide-react"
import AuthStatus from "@/components/auth-status"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1], // ← valid
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
    href: "/request-contract",
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

interface HomePageContentProps {
  locale: string
}

export function HomePageContent({ locale }: HomePageContentProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl">
          Bilingual Contract Management
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Streamline your contract creation and management process with our intuitive platform.
          Choose an action below to get started.
        </p>
      </motion.div>
      <AuthStatus /> {/* Assuming this shows login/logout status */}
      <div className="mt-8 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
            }} // Tailwind shadow
            className="h-full"
          >
            <Card className="flex h-full flex-col transition-all duration-300 hover:shadow-card-hover">
              <CardHeader className="pb-4">
                <div className="mb-2 flex items-center gap-x-3">
                  {" "}
                  {/* RTL: gap-x-3 */}
                  <action.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="font-heading text-xl font-semibold">
                    {action.title}
                  </CardTitle>
                </div>
                <CardDescription className="min-h-[40px] text-sm text-muted-foreground">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-grow items-end">
                {action.hrefExternal ? (
                  <a
                    href={action.hrefExternal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant={action.variant}
                      className="h-12 w-full text-base font-semibold"
                    >
                      {action.title}
                      <ExternalLinkIcon className="ms-2 h-4 w-4" /> {/* RTL: me-2 */}
                    </Button>
                  </a>
                ) : (
                  <Button
                    asChild
                    variant={action.variant}
                    className="h-12 w-full text-base font-semibold"
                  >
                    <Link href={locale ? `/${locale}${action.href}` : action.href}>{action.title}</Link>
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