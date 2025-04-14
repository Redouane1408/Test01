"use client"

import { Link, useLocation } from "react-router-dom"
import { Archive, BarChart3, Home, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"

export function Sidebar() {
  const { pathname } = useLocation()
  const { isAdmin } = useAuth()

  const routes = [
    {
      label: "Tableau de bord",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Archivage",
      icon: Archive,
      href: "/archive",
      active: pathname === "/archive",
    },
    {
      label: "Utilisateurs",
      icon: Users,
      href: "/users",
      active: pathname === "/users",
      admin: true,
    },
    {
      label: "Rapports",
      icon: BarChart3,
      href: "/reports",
      active: pathname === "/reports",
    },
  ]

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 p-2">
            {routes.map((route) =>
              route.admin && !isAdmin ? null : (
                <Button
                  key={route.href}
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", route.active && "bg-primary/10")}
                  asChild
                >
                  <Link to={route.href}>
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Link>
                </Button>
              ),
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
