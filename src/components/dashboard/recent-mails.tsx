import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

// Sample data for recent mails
const recentMails = [
  {
    id: "COR-001",
    subject: "Demande de budget supplémentaire",
    sender: "Direction des Marchés Publics",
    date: "Il y a 2 heures",
    status: "Archivé",
    statusColor: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  },
  {
    id: "COR-002",
    subject: "Rapport financier trimestriel",
    sender: "Service Comptabilité",
    date: "Il y a 5 heures",
    status: "En cours",
    statusColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
  },
  {
    id: "COR-003",
    subject: "Demande d'approbation de projet",
    sender: "Direction Générale",
    date: "Il y a 1 jour",
    status: "En cours",
    statusColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
  },
]

export function RecentMails() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Courriers récents</CardTitle>
        <CardDescription>Vous avez {recentMails.length} courriers récents.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentMails.map((mail) => (
            <div key={mail.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback>
                  <FileText className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{mail.subject}</p>
                <p className="text-sm text-muted-foreground">De: {mail.sender}</p>
              </div>
              <div className="ml-auto text-right">
                <div
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${mail.statusColor}`}
                >
                  {mail.status}
                </div>
                <div className="text-xs text-muted-foreground">{mail.date}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
