"use client"

import { useState, useEffect } from "react"
import {
  Archive,
  ArrowUpDown,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Download,
  Eye,
  Pencil,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { Overview } from "@/components/dashboard/overview"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

// Types for our data
interface Mail {
  id: string
  type: "Entrant" | "Sortant"
  nature: "Externe" | "Interne"
  subject: string
  sender: string
  recipient: string
  date: string
  registrationDate: string
  returnDate: string | null
  status: "Archivé" | "En cours"
  priority: "Normal" | "Urgent"
  attachments: Attachment[]
  description: string
  createdBy: string
  createdAt: string
  modifiedBy: Modification[]
  number: string
}

interface Attachment {
  name: string
  size: string
}

interface Modification {
  user: string
  date: string
}

// Sample data for demonstration
const mails: Mail[] = [
  {
    id: "COR-001",
    type: "Entrant",
    nature: "Externe",
    subject: "Demande de budget supplémentaire",
    sender: "Direction des Marchés Publics",
    recipient: "Division de la réglementation budgétaire",
    date: "2023-03-15",
    registrationDate: "2023-03-15",
    returnDate: "2023-03-20",
    status: "Archivé",
    priority: "Normal",
    attachments: [
      { name: "demande_budget.pdf", size: "1.2 MB" },
      { name: "justificatifs.zip", size: "3.5 MB" },
    ],
    description: "Demande de budget supplémentaire pour le projet de rénovation des locaux administratifs.",
    createdBy: "Mohammed Tazi",
    createdAt: "2023-03-15 09:30",
    modifiedBy: [
      { user: "Ahmed Benali", date: "2023-03-16 14:45" },
      { user: "Fatima Zahra", date: "2023-03-18 10:20" },
    ],
    number: "COR-001",
  },
  {
    id: "COR-002",
    type: "Sortant",
    nature: "Interne",
    subject: "Rapport financier trimestriel",
    sender: "Division de la réglementation budgétaire",
    recipient: "Service Comptabilité",
    date: "2023-03-14",
    registrationDate: "2023-03-14",
    returnDate: null,
    status: "En cours",
    priority: "Normal",
    attachments: [{ name: "rapport_financier_Q1.pdf", size: "2.8 MB" }],
    description: "Rapport financier du premier trimestre 2023.",
    createdBy: "Fatima Zahra",
    createdAt: "2023-03-14 11:15",
    modifiedBy: [{ user: "Mohammed Tazi", date: "2023-03-15 09:30" }],
    number: "COR-002",
  },
  {
    id: "COR-003",
    type: "Entrant",
    nature: "Externe",
    subject: "Demande d'approbation de projet",
    sender: "Direction Générale",
    recipient: "Division de la réglementation budgétaire",
    date: "2023-03-13",
    registrationDate: "2023-03-13",
    returnDate: "2023-03-18",
    status: "En cours",
    priority: "Urgent",
    attachments: [
      { name: "projet_approbation.pdf", size: "4.1 MB" },
      { name: "annexes.pdf", size: "1.7 MB" },
    ],
    description: "Demande d'approbation pour le projet de numérisation des archives.",
    createdBy: "Ahmed Benali",
    createdAt: "2023-03-13 08:45",
    modifiedBy: [],
    number: "COR-003",
  },
  {
    id: "COR-004",
    type: "Entrant",
    nature: "Interne",
    subject: "Validation des dépenses",
    sender: "Service des Achats",
    recipient: "Division de la réglementation budgétaire",
    date: "2023-03-10",
    registrationDate: "2023-03-10",
    returnDate: null,
    status: "En cours",
    priority: "Urgent",
    attachments: [{ name: "depenses_fevrier.xlsx", size: "0.9 MB" }],
    description: "Validation des dépenses du mois de février.",
    createdBy: "Karim Alaoui",
    createdAt: "2023-03-10 14:20",
    modifiedBy: [],
    number: "COR-004",
  },
  {
    id: "COR-005",
    type: "Sortant",
    nature: "Externe",
    subject: "Demande de recrutement",
    sender: "Division de la réglementation budgétaire",
    recipient: "Ressources Humaines",
    date: "2023-03-12",
    registrationDate: "2023-03-12",
    returnDate: "2023-03-17",
    status: "Archivé",
    priority: "Normal",
    attachments: [
      { name: "fiche_poste.pdf", size: "0.5 MB" },
      { name: "budget_poste.pdf", size: "0.3 MB" },
    ],
    description: "Demande de recrutement pour un poste d'analyste financier.",
    createdBy: "Nadia Mansouri",
    createdAt: "2023-03-12 10:30",
    modifiedBy: [
      { user: "Ahmed Benali", date: "2023-03-13 11:15" },
      { user: "Mohammed Tazi", date: "2023-03-14 09:45" },
    ],
    number: "COR-005",
  },
]

// Données réelles pour le graphique
const realMailData = [
  {
    name: "Jan",
    total: 132,
  },
  {
    name: "Fév",
    total: 145,
  },
  {
    name: "Mar",
    total: 164,
  },
  {
    name: "Avr",
    total: 121,
  },
  {
    name: "Mai",
    total: 148,
  },
  {
    name: "Juin",
    total: 156,
  },
  {
    name: "Juil",
    total: 118,
  },
  {
    name: "Août",
    total: 110,
  },
  {
    name: "Sep",
    total: 142,
  },
  {
    name: "Oct",
    total: 152,
  },
  {
    name: "Nov",
    total: 138,
  },
  {
    name: "Déc",
    total: 124,
  },
]

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMails, setSelectedMails] = useState<string[]>([])
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  // Utiliser des données réelles pour les courriers récents
  const [recentMails, setRecentMails] = useState<Mail[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuler un appel API pour récupérer les courriers récents
    const fetchRecentMails = async () => {
      try {
        setIsLoading(true)
        // Dans une application réelle, ceci serait remplacé par un appel API
        // Exemple: const response = await api.get('/mails/recent');

        // Données simulées pour l
        setRecentMails(mails.slice(0, 5)) // Afficher les 5 premiers courriers
      } catch (error) {
        console.error("Erreur lors de la récupération des courriers récents:", error)
        toast({
          title: "Erreur",
          description: "Erreur lors de la récupération des courriers récents.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentMails()
  }, [toast])

  const filteredMails = mails.filter(
    (mail) =>
      mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Archivé":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "En cours":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      case "Normal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMails(filteredMails.map((mail) => mail.id))
    } else {
      setSelectedMails([])
    }
  }

  const handleSelectMail = (id: string) => {
    if (selectedMails.includes(id)) {
      setSelectedMails(selectedMails.filter((mailId) => mailId !== id))
    } else {
      setSelectedMails([...selectedMails, id])
    }
  }

  const handleExport = () => {
    // In a real application, this would generate a CSV or Excel file
    const exportData = filteredMails.map((mail) => ({
      "N° de courrier": mail.id,
      Type: mail.type,
      Nature: mail.nature,
      Objet: mail.subject,
      "Date d'enregistrement": mail.registrationDate,
      Statut: mail.status,
      Priorité: mail.priority,
      Expéditeur: mail.sender,
      Destinataire: mail.recipient,
    }))

    // For demonstration, we'll just show a toast
    toast({
      title: "Export réussi",
      description: `${exportData.length} courriers exportés.`,
    })
  }

  // Ajoutez une fonction pour gérer le focus dans les menus déroulants
  const handleDropdownAction = (action: () => void) => {
    // Déplacer le focus vers le body avant d'exécuter l'action
    document.body.focus()

    // Exécuter l'action après un court délai
    setTimeout(() => {
      action()
    }, 10)
  }

  const handleViewDetails = (mail: Mail) => {
    // Navigate to mail details page
    navigate(`/courriers/${mail.id}`)
  }

  const handleNewMail = () => {
    // Navigate to archive page
    navigate("/archive")
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleNewMail}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Nouveau courrier</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 w-full">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="mails">Courriers</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 w-full">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total des courriers</CardTitle>
                <Archive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courriers entrants</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">845</div>
                <p className="text-xs text-muted-foreground">+8% par rapport au mois dernier</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courriers sortants</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">403</div>
                <p className="text-xs text-muted-foreground">+18% par rapport au mois dernier</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">+5% par rapport au mois dernier</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Aperçu des courriers</CardTitle>
                <CardDescription>Nombre de courriers par mois</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={realMailData} />
              </CardContent>
            </Card>
            <Card className="flex flex-col col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courriers récents</CardTitle>
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pl-2 flex-grow">
                {/* Remplacer le tableau des courriers récents */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N°de courrier</TableHead>
                        <TableHead>Objet</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Nature</TableHead>
                        <TableHead>Priorité</TableHead>
                        <TableHead>Date d'enregistrement</TableHead>
                        <TableHead>Expéditeur</TableHead>
                        <TableHead>Destinataire</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentMails.map((mail) => (
                        <TableRow key={mail.id}>
                          <TableCell className="font-medium">{mail.number}</TableCell>
                          <TableCell>{mail.subject}</TableCell>
                          <TableCell>{mail.type}</TableCell>
                          <TableCell>{mail.nature}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(mail.priority)}`}
                            >
                              {mail.priority}
                            </span>
                          </TableCell>
                          <TableCell>{format(mail.registrationDate, "dd/MM/yyyy")}</TableCell>
                          <TableCell>{typeof mail.sender === "string" ? mail.sender : mail.sender}</TableCell>
                          <TableCell>{typeof mail.recipient === "string" ? mail.recipient : mail.recipient}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(mail.status)}`}
                            >
                              {mail.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Ouvrir le menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigate(`/courriers/${mail.id}`)}>
                                  Voir les détails
                                </DropdownMenuItem>
                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Archiver</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <div className="flex items-center justify-end p-4">
                <Button onClick={() => navigate("/archive")} size="sm">
                  Voir tous les courriers
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Analytiques des courriers</CardTitle>
              <CardDescription>Analyse détaillée des courriers par type et département</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Graphiques analytiques</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mails" className="space-y-4 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Liste des courriers</CardTitle>
              <CardDescription>Tous les courriers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <Input
                  type="search"
                  placeholder="Rechercher un courrier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-2">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrer
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
                      <DropdownMenuItem>Type</DropdownMenuItem>
                      <DropdownMenuItem>Nature</DropdownMenuItem>
                      <DropdownMenuItem>Priorité</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Statut</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" className="ml-2" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedMails.length === filteredMails.length && filteredMails.length > 0}
                          onCheckedChange={(checked) => handleSelectAll(checked || false)}
                        />
                      </TableHead>
                      <TableHead>N° de courrier</TableHead>
                      <TableHead>Objet</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Nature</TableHead>
                      <TableHead>Date d'enregistrement</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Expéditeur</TableHead>
                      <TableHead>Destinataire</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMails.map((mail) => (
                      <TableRow key={mail.id}>
                        <TableCell className="w-[50px]">
                          <Checkbox
                            checked={selectedMails.includes(mail.id)}
                            onCheckedChange={() => handleSelectMail(mail.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{mail.id}</TableCell>
                        <TableCell>{mail.subject}</TableCell>
                        <TableCell>{mail.type}</TableCell>
                        <TableCell>{mail.nature}</TableCell>
                        <TableCell>{mail.registrationDate}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(mail.status)}`}
                          >
                            {mail.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(mail.priority)}`}
                          >
                            {mail.priority}
                          </span>
                        </TableCell>
                        <TableCell>{mail.sender}</TableCell>
                        <TableCell>{mail.recipient}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDetails(mail)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="mr-2 h-4 w-4" />
                                Archiver
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <History className="mr-2 h-4 w-4" />
                                Historique
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
