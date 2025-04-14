import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/layouts/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
//import { Link } from "react-router-dom"
//import { Archive } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 w-full">
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold"></h1>
      </div>
      <div className="flex-1 md:grow-0">
        <form>
        <div className="flex h-full max-h-screen flex-col gap-2">
        
            <div className="flex items-center gap-2 font-semibold">

                <h1 className="flex h-full max-h-screen flex-row gap-2"> 
                    <img src="logo-app.svg" alt=" Logo" className="w-6 h-6 md:w-8 md:h-8" />
                    <span className="text-lg font-bold">Archivi</span>
                </h1>
                

            
            </div>
        </div>

        </form>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  )
}
