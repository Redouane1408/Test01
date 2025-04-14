import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-4 text-center w-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">Page non trouvée</h2>
      <p className="max-w-md text-muted-foreground">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Button asChild>
        <Link to="/dashboard">Retour au tableau de bord</Link>
      </Button>
    </div>
  )
}