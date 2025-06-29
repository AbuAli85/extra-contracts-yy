"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { FileTextIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Contracts",
    href: "/contracts",
    description: "View and manage all your generated contracts.",
  },
  {
    title: "Generate New",
    href: "/generate-contract",
    description: "Create a new bilingual contract.",
  },
  {
    title: "Parties",
    href: "/manage-parties",
    description: "Manage first and second parties involved in contracts.",
  },
  {
    title: "Promoters",
    href: "/manage-promoters",
    description: "Manage promoters associated with contracts.",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Access analytics, audit logs, and notifications.",
  },
]

export function MainNav() {
  const pathname = usePathname()
  const t = useTranslations("MainNav")

  return (
    <div className="hidden gap-6 lg:flex">
      <Link href="/" className="flex items-center space-x-2">
        <FileTextIcon className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Contract App</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{t("gettingStarted")}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <FileTextIcon className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">Contract Generator</div>
                      <p className="text-sm leading-tight text-muted-foreground">{t("mainNavDescription")}</p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/contracts" title={t("contractsTitle")}>
                  {t("contractsDescription")}
                </ListItem>
                <ListItem href="/generate-contract" title={t("generateNewTitle")}>
                  {t("generateNewDescription")}
                </ListItem>
                <ListItem href="/dashboard" title={t("dashboardTitle")}>
                  {t("dashboardDescription")}
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{t("components")}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/manage-promoters" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>{t("promoters")}</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/manage-parties" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>{t("parties")}</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
