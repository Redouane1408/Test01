import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/layouts/sidebar"
import { Header } from "@/components/layouts/header"

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col w-screen">
      <Header />
      <div className="flex flex-1 w-full">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}