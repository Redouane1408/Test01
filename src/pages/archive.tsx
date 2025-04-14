"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Download, Eye, FileText, Filter, History, MoreHorizontal, Pencil, Plus, Search, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types for our data
interface Attachment {
  name: string
  size: string
}

interface Modification {
  user: string
  date: string
}

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
}

interface Division {
  id: string
  name: string
  directions: Direction[]
}

interface Direction {
  id: string
  name: string
  sousDirections: SousDirection[]
}

interface SousDirection {
  id: string
  name: string
}

interface FilterState {
  id: string
  type: string
  nature: string
  subject: string
  dateFrom: string
  dateTo: string
  dateReceptionFrom: string
  dateReceptionTo: string
  dateRetourFrom: string
  dateRetourTo: string
  status: string
  priority: string
  sender: {
    type?: "Interne" | "Externe" | "Particulier"
    department?: string
    service?: string
    name?: string
  }
  recipient: {
    type?: "Interne" | "Externe" | "Particulier"
    department?: string
    service?: string
    name?: string
  }
  senderDivision: string
  senderDirection: string
  senderSousDirection: string
  recipientDivision: string
  recipientDirection: string
  recipientSousDirection: string
  showSenderDirection: boolean
  showSenderSousDirection: boolean
  showRecipientDirection: boolean
  showRecipientSousDirection: boolean
}

// Sample data for mails (replace with your actual data source)
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
  },
]

// Sample data for departments and services
const departments = [
  {
    id: "dep1",
    name: "Direction Générale",
    services: [
      { id: "serv1", name: "Service du Courrier" },
      { id: "serv2", name: "Service des Archives" },
    ],
  },
  {
    id: "dep2",
    name: "Division Financière",
    services: [
      { id: "serv3", name: "Service Comptabilité" },
      { id: "serv4", name: "Service Budget" },
    ],
  },
]

export function ArchivePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined)
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null)
  const [selectedMails, setSelectedMails] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    id: "",
    type: "",
    nature: "",
    subject: "",
    dateFrom: "",
    dateTo: "",
    dateReceptionFrom: "",
    dateReceptionTo: "",
    dateRetourFrom: "",
    dateRetourTo: "",
    status: "",
    priority: "",
    sender: {
      type: undefined,
      department: undefined,
      service: undefined,
      name: undefined,
    },
    recipient: {
      type: undefined,
      department: undefined,
      service: undefined,
      name: undefined,
    },
    senderDivision: "",
    senderDirection: "",
    senderSousDirection: "",
    recipientDivision: "",
    recipientDirection: "",
    recipientSousDirection: "",
    showSenderDirection: false,
    showSenderSousDirection: false,
    showRecipientDirection: false,
    showRecipientSousDirection: false,
  })

  const [newMailType, setNewMailType] = useState<"Entrant" | "Sortant">("Entrant")
  const [newMailNature, setNewMailNature] = useState<"Externe" | "Interne">("Externe")
  const [showReturnDate, setShowReturnDate] = useState(false)
  const [senderStopAtDivision, setSenderStopAtDivision] = useState(false)
  const [senderStopAtDirection, setSenderStopAtDirection] = useState(false)
  const [recipientStopAtDivision, setRecipientStopAtDivision] = useState(false)
  const [recipientStopAtDirection, setRecipientStopAtDirection] = useState(false)

  // First, let's add the state variables for the checkboxes to control the hierarchical selection
  // Add these to the existing state variables at the top of the component
  const [showDirectionSelect, setShowDirectionSelect] = useState(false)
  const [showSousDirectionSelect, setShowSousDirectionSelect] = useState(false)

  // Add state for the selected division, direction, and sous-direction
  const [selectedDivision, setSelectedDivision] = useState<string>("")
  const [selectedDirection, setSelectedDirection] = useState<string>("")

  // Add the hierarchical data for divisions, directions, and sous-directions
  const divisionsData: Division[] = [
    {
      id: "div1",
      name: "Division des Ressources Humaines",
      directions: [
        {
          id: "dir1",
          name: "Direction du Personnel",
          sousDirections: [
            { id: "sdir1", name: "Sous-Direction des Recrutements" },
            { id: "sdir2", name: "Sous-Direction des Carrières" },
          ],
        },
        {
          id: "dir2",
          name: "Direction de la Formation",
          sousDirections: [
            { id: "sdir3", name: "Sous-Direction des Formations Continues" },
            { id: "sdir4", name: "Sous-Direction des Stages" },
          ],
        },
      ],
    },
    {
      id: "div2",
      name: "Division Financière",
      directions: [
        {
          id: "dir3",
          name: "Direction du Budget",
          sousDirections: [
            { id: "sdir5", name: "Sous-Direction des Prévisions" },
            { id: "sdir6", name: "Sous-Direction du Suivi" },
          ],
        },
        {
          id: "dir4",
          name: "Direction de la Comptabilité",
          sousDirections: [
            { id: "sdir7", name: "Sous-Direction des Marchés" },
            { id: "sdir8", name: "Sous-Direction du Budget" },
          ],
        },
      ],
    },
    {
      id: "div3",
      name: "Division Technique",
      directions: [
        {
          id: "dir5",
          name: "Direction des Infrastructures",
          sousDirections: [
            { id: "sdir9", name: "Sous-Direction des Bâtiments" },
            { id: "sdir10", name: "Sous-Direction des Équipements" },
          ],
        },
        {
          id: "dir6",
          name: "Direction des Systèmes d'Information",
          sousDirections: [
            { id: "sdir11", name: "Sous-Direction du Développement" },
            { id: "sdir12", name: "Sous-Direction des Réseaux" },
          ],
        },
      ],
    },
  ]

  // Ajoutez un état pour contrôler manuellement l'ouverture du menu déroulant
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Refs for dialogs to prevent UI blocking
  const viewDialogRef = useRef<HTMLDivElement>(null)
  const editDialogRef = useRef<HTMLDivElement>(null)
  const historyDialogRef = useRef<HTMLDivElement>(null)
  const addDialogRef = useRef<HTMLDivElement>(null)

  // Apply filters to the mails
  const filteredMails = mails.filter((mail) => {
    // First apply search term filter
    const matchesSearch =
      mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mail.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    // Then apply specific filters
    if (filters.id && !mail.id.toLowerCase().includes(filters.id.toLowerCase())) return false
    if (filters.type && mail.type !== filters.type) return false
    if (filters.nature && mail.nature !== filters.nature) return false
    if (filters.subject && !mail.subject.toLowerCase().includes(filters.subject.toLowerCase())) return false
    if (filters.status && mail.status !== filters.status) return false
    if (filters.priority && mail.priority !== filters.priority) return false

    // Sender filter with hierarchical selection
    if (filters.senderDivision) {
      const division = divisionsData.find((div) => div.id === filters.senderDivision)
      if (!division) return false

      const divisionName = division.name
      if (!mail.sender.includes(divisionName)) {
        // Check if sender matches a direction in this division
        if (filters.showSenderDirection && filters.senderDirection) {
          const direction = division.directions.find((dir) => dir.id === filters.senderDirection)
          if (!direction || !mail.sender.includes(direction.name)) {
            // Check if sender matches a sous-direction
            if (filters.showSenderSousDirection && filters.senderSousDirection) {
              const sousDirection = direction?.sousDirections.find((sdir) => sdir.id === filters.senderSousDirection)
              if (!sousDirection || !mail.sender.includes(sousDirection.name)) {
                return false
              }
            } else {
              return false
            }
          }
        } else {
          return false
        }
      }
    } else if (
      filters.sender &&
      filters.sender.name &&
      !mail.sender.toLowerCase().includes(filters.sender.name.toLowerCase())
    ) {
      return false
    }

    // Recipient filter with hierarchical selection
    if (filters.recipientDivision) {
      const division = divisionsData.find((div) => div.id === filters.recipientDivision)
      if (!division) return false

      const divisionName = division.name
      if (!mail.recipient.includes(divisionName)) {
        // Check if recipient matches a direction in this division
        if (filters.showRecipientDirection && filters.recipientDirection) {
          const direction = division.directions.find((dir) => dir.id === filters.recipientDirection)
          if (!direction || !mail.recipient.includes(direction.name)) {
            // Check if recipient matches a sous-direction
            if (filters.showRecipientSousDirection && filters.recipientSousDirection) {
              const sousDirection = direction?.sousDirections.find((sdir) => sdir.id === filters.recipientSousDirection)
              if (!sousDirection || !mail.recipient.includes(sousDirection.name)) {
                return false
              }
            } else {
              return false
            }
          }
        } else {
          return false
        }
      }
    } else if (
      filters.recipient &&
      filters.recipient.name &&
      !mail.recipient.toLowerCase().includes(filters.recipient.name.toLowerCase())
    ) {
      return false
    }

    // Date range filter for registration date
    if (filters.dateFrom || filters.dateTo) {
      const mailDate = new Date(mail.registrationDate)
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        if (mailDate < fromDate) return false
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        if (mailDate > toDate) return false
      }
    }

    // Date range filter for reception/envoi date
    if (filters.dateReceptionFrom || filters.dateReceptionTo) {
      const mailReceptionDate = new Date(mail.date)
      if (filters.dateReceptionFrom) {
        const fromDate = new Date(filters.dateReceptionFrom)
        if (mailReceptionDate < fromDate) return false
      }
      if (filters.dateReceptionTo) {
        const toDate = new Date(filters.dateReceptionTo)
        if (mailReceptionDate > toDate) return false
      }
    }

    // Date range filter for return date
    if (filters.dateRetourFrom || filters.dateRetourTo) {
      // Skip if mail has no return date
      if (!mail.returnDate) {
        if (filters.dateRetourFrom || filters.dateRetourTo) return false
      } else {
        const mailReturnDate = new Date(mail.returnDate)
        if (filters.dateRetourFrom) {
          const fromDate = new Date(filters.dateRetourFrom)
          if (mailReturnDate < fromDate) return false
        }
        if (filters.dateRetourTo) {
          const toDate = new Date(filters.dateRetourTo)
          if (mailReturnDate > toDate) return false
        }
      }
    }

    return true
  })

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

  const handleAddMail = (e: React.FormEvent) => {
    e.preventDefault()
    safeCloseDialog(setIsAddDialogOpen)

    toast({
      title: "Courrier ajouté",
      description: "Le courrier a été ajouté avec succès.",
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    safeCloseDialog(setIsEditDialogOpen)

    toast({
      title: "Courrier modifié",
      description: "Le courrier a été modifié avec succès.",
    })
  }

  // Modifiez également les fonctions de gestion des actions pour s'assurer qu'elles nettoient correctement après leur exécution
  const handleViewDetails = (mail: Mail) => {
    setSelectedMail(mail)
    setIsViewDialogOpen(true)
    // Assurez-vous que le menu est fermé
    setOpenDropdownId(null)
  }

  const openEditDialog = (mail: Mail) => {
    setSelectedMail(mail)
    setIsEditDialogOpen(true)
    // Assurez-vous que le menu est fermé
    setOpenDropdownId(null)
  }

  const openHistoryDialog = (mail: Mail) => {
    setSelectedMail(mail)
    setIsHistoryDialogOpen(true)
    // Assurez-vous que le menu est fermé
    setOpenDropdownId(null)
  }

  const handleDownloadAttachments = (mail: Mail) => {
    // Assurez-vous que le menu est fermé
    setOpenDropdownId(null)
    toast({
      title: "Téléchargement des pièces jointes",
      description: `${mail.attachments.length} fichier(s) en cours de téléchargement.`,
    })
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

  const resetFilters = () => {
    setFilters({
      id: "",
      type: "",
      nature: "",
      subject: "",
      dateFrom: "",
      dateTo: "",
      dateReceptionFrom: "",
      dateReceptionTo: "",
      dateRetourFrom: "",
      dateRetourTo: "",
      status: "",
      priority: "",
      sender: {
        type: undefined,
        department: undefined,
        service: undefined,
        name: undefined,
      },
      recipient: {
        type: undefined,
        department: undefined,
        service: undefined,
        name: undefined,
      },
      senderDivision: "",
      senderDirection: "",
      senderSousDirection: "",
      recipientDivision: "",
      recipientDirection: "",
      recipientSousDirection: "",
      showSenderDirection: false,
      showSenderSousDirection: false,
      showRecipientDirection: false,
      showRecipientSousDirection: false,
    })
  }

  const isAdmin = user?.role === "ADMIN"

  // Let's update the handleDivisionChange function to manage the hierarchical selection
  const handleDivisionChange = (value: string) => {
    setSelectedDivision(value)
    setSelectedDirection("")
  }

  const handleDirectionChange = (value: string) => {
    setSelectedDirection(value)
  }

  // Get the available directions based on the selected division
  const getAvailableDirections = () => {
    const division = divisionsData.find((div) => div.id === selectedDivision)
    return division ? division.directions : []
  }

  // Get the available sous-directions based on the selected direction
  const getAvailableSousDirections = () => {
    const division = divisionsData.find((div) => div.id === selectedDivision)
    if (!division) return []

    const direction = division.directions.find((dir) => dir.id === selectedDirection)
    return direction ? direction.sousDirections : []
  }

  // Let's also update the recipient section with the same hierarchical selection pattern
  // Find the recipient section in the form and update it

  // Add these state variables at the top of the component
  const [recipientSelectedDivision, setRecipientSelectedDivision] = useState<string>("")
  const [recipientSelectedDirection, setRecipientSelectedDirection] = useState<string>("")
  const [showRecipientDirectionSelect, setShowRecipientDirectionSelect] = useState(false)
  const [showRecipientSousDirectionSelect, setShowRecipientSousDirectionSelect] = useState(false)

  // Add these handler functions
  const handleRecipientDivisionChange = (value: string) => {
    setRecipientSelectedDivision(value)
    setRecipientSelectedDirection("")
  }

  const handleRecipientDirectionChange = (value: string) => {
    setRecipientSelectedDirection(value)
  }

  // Get the available directions based on the selected division for recipient
  const getRecipientAvailableDirections = () => {
    const division = divisionsData.find((div) => div.id === recipientSelectedDivision)
    return division ? division.directions : []
  }

  // Get the available sous-directions based on the selected direction for recipient
  const getRecipientAvailableSousDirections = () => {
    const division = divisionsData.find((div) => div.id === recipientSelectedDivision)
    if (!division) return []

    const direction = division.directions.find((dir) => dir.id === recipientSelectedDirection)
    return direction ? direction.sousDirections : []
  }

  // Handlers for filter hierarchical selection
  const handleFilterSenderDivisionChange = (value: string) => {
    setFilters({
      ...filters,
      senderDivision: value,
      senderDirection: "",
      senderSousDirection: "",
    })
  }

  const handleFilterSenderDirectionChange = (value: string) => {
    setFilters({
      ...filters,
      senderDirection: value,
      senderSousDirection: "",
    })
  }

  const handleFilterSenderSousDirectionChange = (value: string) => {
    setFilters({
      ...filters,
      senderSousDirection: value,
    })
  }

  const handleFilterRecipientDivisionChange = (value: string) => {
    setFilters({
      ...filters,
      recipientDivision: value,
      recipientDirection: "",
      recipientSousDirection: "",
    })
  }

  const handleFilterRecipientDirectionChange = (value: string) => {
    setFilters({
      ...filters,
      recipientDirection: value,
      recipientSousDirection: "",
    })
  }

  const handleFilterRecipientSousDirectionChange = (value: string) => {
    setFilters({
      ...filters,
      recipientSousDirection: value,
    })
  }

  // Get available directions and sous-directions for filters
  const getFilterSenderAvailableDirections = () => {
    const division = divisionsData.find((div) => div.id === filters.senderDivision)
    return division ? division.directions : []
  }

  const getFilterSenderAvailableSousDirections = () => {
    const division = divisionsData.find((div) => div.id === filters.senderDivision)
    if (!division) return []

    const direction = division.directions.find((dir) => dir.id === filters.senderDirection)
    return direction ? direction.sousDirections : []
  }

  const getFilterRecipientAvailableDirections = () => {
    const division = divisionsData.find((div) => div.id === filters.recipientDivision)
    return division ? division.directions : []
  }

  const getFilterRecipientAvailableSousDirections = () => {
    const division = divisionsData.find((div) => div.id === filters.recipientDivision)
    if (!division) return []

    const direction = division.directions.find((dir) => dir.id === filters.recipientDirection)
    return direction ? direction.sousDirections : []
  }

  // Function to safely close dialogs
  const safeCloseDialog = (setDialogState: React.Dispatch<React.SetStateAction<boolean>>) => {
    // Trouver tous les éléments focusables dans le document
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    // Vérifier si un élément dans un dialogue a le focus
    const dialogFocused = Array.from(focusableElements).some((el) => {
      const closestDialog = el.closest('[role="dialog"]')
      return closestDialog && document.activeElement === el
    })

    // Si un élément dans un dialogue a le focus, déplacer le focus vers le body
    if (dialogFocused) {
      document.body.focus()
    }

    // Fermer le dialogue
    setDialogState(false)

    // Assurer que le body n'est pas verrouillé
    document.body.style.pointerEvents = "auto"
    document.body.style.overflow = "auto"

    // Nettoyer les attributs aria-hidden qui pourraient causer des problèmes
    setTimeout(() => {
      const hiddenElements = document.querySelectorAll('[aria-hidden="true"]')
      hiddenElements.forEach((el) => {
        if (el.contains(document.activeElement)) {
          el.setAttribute("aria-hidden", "false")
        }
      })
    }, 100)
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

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }))
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Archivage des courriers</h2>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              // Déplacer le focus avant de fermer le dialogue
              document.body.focus()
              safeCloseDialog(setIsAddDialogOpen)
            } else {
              setIsAddDialogOpen(open)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau courrier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]" ref={addDialogRef}>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau courrier</DialogTitle>
              <DialogDescription>Remplissez les informations du courrier à archiver.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMail}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailNumber">Numéro de courrier</Label>
                    <Input id="mailNumber" placeholder="COR-XXX" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      required
                      value={newMailType}
                      onValueChange={(value) => setNewMailType(value as "Entrant" | "Sortant")}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entrant">Entrant</SelectItem>
                        <SelectItem value="Sortant">Sortant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nature">Nature</Label>
                    <Select
                      required
                      value={newMailNature}
                      onValueChange={(value) => setNewMailNature(value as "Externe" | "Interne")}
                    >
                      <SelectTrigger id="nature">
                        <SelectValue placeholder="Sélectionner une nature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Externe">Externe</SelectItem>
                        <SelectItem value="Interne">Interne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Objet</Label>
                  <Input id="subject" placeholder="Objet du courrier" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expéditeur - varie selon le type et la nature */}
                  <div className="space-y-2">
                    <Label htmlFor="sender">Expéditeur</Label>
                    {newMailType === "Sortant" ? (
                      // Cas 1 et 2: Expéditeur fixe
                      <Input
                        id="sender"
                        value="Division de la réglementation budgétaire du controle et des marchés publics"
                        readOnly
                        className="bg-muted"
                      />
                    ) : newMailNature === "Externe" ? (
                      // Cas 3: Liste des ministères
                      <Select required>
                        <SelectTrigger id="sender-ministry">
                          <SelectValue placeholder="Sélectionner un ministère" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="defense">Ministère de la Défense</SelectItem>
                          <SelectItem value="interieur">Ministère de l'Intérieur</SelectItem>
                          <SelectItem value="affaires-etrangeres">Ministère des Affaires étrangères</SelectItem>
                          <SelectItem value="justice">Ministère de la Justice</SelectItem>
                          <SelectItem value="sante">Ministère de la Santé</SelectItem>
                          <SelectItem value="autre">Autre...</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      // Cas 4: Sélection hiérarchique pour Entrant/Interne
                      <div className="space-y-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Select required value={selectedDivision} onValueChange={handleDivisionChange}>
                              <SelectTrigger id="sender-division">
                                <SelectValue placeholder="Division" />
                              </SelectTrigger>
                              <SelectContent>
                                {divisionsData.map((division) => (
                                  <SelectItem key={division.id} value={division.id}>
                                    {division.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1">
                              <Checkbox
                                id="show-direction"
                                checked={showDirectionSelect}
                                onCheckedChange={(checked) => setShowDirectionSelect(checked === true)}
                              />
                              <Label htmlFor="show-direction" className="text-xs">
                                Direction
                              </Label>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Select
                              disabled={!showDirectionSelect || !selectedDivision}
                              value={selectedDirection}
                              onValueChange={handleDirectionChange}
                            >
                              <SelectTrigger id="sender-direction">
                                <SelectValue placeholder="Direction" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableDirections().map((direction) => (
                                  <SelectItem key={direction.id} value={direction.id}>
                                    {direction.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1">
                              <Checkbox
                                id="show-sous-direction"
                                checked={showSousDirectionSelect}
                                onCheckedChange={(checked) => setShowSousDirectionSelect(checked === true)}
                                disabled={!showDirectionSelect || !selectedDirection}
                              />
                              <Label htmlFor="show-sous-direction" className="text-xs">
                                Sous-Direction
                              </Label>
                            </div>
                          </div>

                          <Select disabled={!showSousDirectionSelect || !selectedDirection}>
                            <SelectTrigger id="sender-sous-direction">
                              <SelectValue placeholder="Sous-Direction" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableSousDirections().map((sousDirection) => (
                                <SelectItem key={sousDirection.id} value={sousDirection.id}>
                                  {sousDirection.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Destinataire - varie selon le type et la nature */}
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Destinataire</Label>
                    {newMailType === "Sortant" && newMailNature === "Externe" ? (
                      // Cas 1: Liste des ministères
                      <Select required>
                        <SelectTrigger id="recipient-ministry">
                          <SelectValue placeholder="Sélectionner un ministère" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="defense">Ministère de la Défense</SelectItem>
                          <SelectItem value="interieur">Ministère de l'Intérieur</SelectItem>
                          <SelectItem value="affaires-etrangeres">Ministère des Affaires étrangères</SelectItem>
                          <SelectItem value="justice">Ministère de la Justice</SelectItem>
                          <SelectItem value="sante">Ministère de la Santé</SelectItem>
                          <SelectItem value="autre">Autre...</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : newMailType === "Entrant" && newMailNature === "Interne" ? (
                      // Fixed Division for Entrant/Interne
                      <div className="space-y-2">
                        <div className="flex flex-col gap-2">
                          <Input
                            id="recipient"
                            value="Division de la réglementation budgétaire du controle et des marchés publics"
                            readOnly
                            className="bg-muted"
                          />

                          <div className="flex items-center gap-2 mt-2">
                            <Select
                              disabled={!showRecipientDirectionSelect}
                              value={recipientSelectedDirection}
                              onValueChange={handleRecipientDirectionChange}
                            >
                              <SelectTrigger id="recipient-direction">
                                <SelectValue placeholder="Direction" />
                              </SelectTrigger>
                              <SelectContent>
                                {getRecipientAvailableDirections().map((direction) => (
                                  <SelectItem key={direction.id} value={direction.id}>
                                    {direction.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1">
                              <Checkbox
                                id="show-recipient-direction"
                                checked={showRecipientDirectionSelect}
                                onCheckedChange={(checked) => setShowRecipientDirectionSelect(checked === true)}
                              />
                              <Label htmlFor="show-recipient-direction" className="text-xs">
                                Direction
                              </Label>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Select disabled={!showRecipientSousDirectionSelect || !recipientSelectedDirection}>
                              <SelectTrigger id="recipient-sous-direction">
                                <SelectValue placeholder="Sous-Direction" />
                              </SelectTrigger>
                              <SelectContent>
                                {getRecipientAvailableSousDirections().map((sousDirection) => (
                                  <SelectItem key={sousDirection.id} value={sousDirection.id}>
                                    {sousDirection.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1">
                              <Checkbox
                                id="show-recipient-sous-direction"
                                checked={showRecipientSousDirectionSelect}
                                onCheckedChange={(checked) => setShowRecipientSousDirectionSelect(checked === true)}
                                disabled={!showRecipientDirectionSelect}
                              />
                              <Label htmlFor="show-recipient-sous-direction" className="text-xs">
                                Sous-Direction
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Cas 2, 3, 4: Sélection hiérarchique
                      <div className="space-y-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Select
                              required
                              value={recipientSelectedDivision}
                              onValueChange={handleRecipientDivisionChange}
                            >
                              <SelectTrigger id="recipient-division">
                                <SelectValue placeholder="Division" />
                              </SelectTrigger>
                              <SelectContent>
                                {divisionsData.map((division) => (
                                  <SelectItem key={division.id} value={division.id}>
                                    {division.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1">
                              <Checkbox
                                id="show-recipient-direction"
                                checked={showRecipientDirectionSelect}
                                onCheckedChange={(checked) => setShowRecipientDirectionSelect(checked === true)}
                              />
                              <Label htmlFor="show-recipient-direction" className="text-xs">
                                Direction
                              </Label>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Select
                              disabled={!showRecipientDirectionSelect || !recipientSelectedDivision}
                              value={recipientSelectedDirection}
                              onValueChange={handleRecipientDirectionChange}
                            >
                              <SelectTrigger id="recipient-direction">
                                <SelectValue placeholder="Direction" />
                              </SelectTrigger>
                              <SelectContent>
                                {getRecipientAvailableDirections().map((direction) => (
                                  <SelectItem key={direction.id} value={direction.id}>
                                    {direction.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1">
                              <Checkbox
                                id="show-recipient-sous-direction"
                                checked={showRecipientSousDirectionSelect}
                                onCheckedChange={(checked) => setShowRecipientSousDirectionSelect(checked === true)}
                                disabled={!showRecipientDirectionSelect || !recipientSelectedDirection}
                              />
                              <Label htmlFor="show-recipient-sous-direction" className="text-xs">
                                Sous-Direction
                              </Label>
                            </div>
                          </div>

                          <Select disabled={!showRecipientSousDirectionSelect || !recipientSelectedDirection}>
                            <SelectTrigger id="recipient-sous-direction">
                              <SelectValue placeholder="Sous-Direction" />
                            </SelectTrigger>
                            <SelectContent>
                              {getRecipientAvailableSousDirections().map((sousDirection) => (
                                <SelectItem key={sousDirection.id} value={sousDirection.id}>
                                  {sousDirection.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{newMailType === "Entrant" ? "Date de réception" : "Date d'envoi"}</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={date ? format(date, "yyyy-MM-dd") : ""}
                        onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : undefined)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className={!showReturnDate ? "text-muted-foreground" : ""}>Date de retour</Label>
                      <Checkbox
                        id="show-return-date"
                        checked={showReturnDate}
                        onCheckedChange={(checked) => setShowReturnDate(checked === true)}
                      />
                    </div>
                    <div className="relative">
                      <Input
                        type="date"
                        value={returnDate ? format(returnDate, "yyyy-MM-dd") : ""}
                        onChange={(e) => setReturnDate(e.target.value ? new Date(e.target.value) : undefined)}
                        className="w-full"
                        disabled={!showReturnDate}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priorité</Label>
                    <Select required>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Sélectionner une priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select required>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Archivé">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">Pièce jointe (scan)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="file" type="file" className="flex-1" />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Description du courrier" className="min-h-[100px]" />
                </div>

                <p className="text-xs text-muted-foreground">Formats acceptés: PDF, JPG, PNG. Taille maximale: 10MB.</p>
              </div>
              <DialogFooter>
                <Button type="submit">Ajouter le courrier</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Details Dialog */}
      <Dialog
        open={isViewDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Déplacer le focus avant de fermer le dialogue
            document.body.focus()
            safeCloseDialog(setIsViewDialogOpen)
          } else {
            setIsViewDialogOpen(open)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]" ref={viewDialogRef}>
          <DialogHeader>
            <DialogTitle>Détails du courrier</DialogTitle>
            <DialogDescription>Informations détaillées du courrier {selectedMail?.id}</DialogDescription>
          </DialogHeader>
          {selectedMail && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">N° de courrier</Label>
                  <p className="font-medium">{selectedMail.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="font-medium">{selectedMail.type}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Nature</Label>
                <p className="font-medium">{selectedMail.nature}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Objet</Label>
                <p className="font-medium">{selectedMail.subject}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Expéditeur</Label>
                  <p className="font-medium">{selectedMail.sender}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Destinataire</Label>
                  <p className="font-medium">{selectedMail.recipient}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date d'enregistrement</Label>
                  <p className="font-medium">{new Date(selectedMail.registrationDate).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date de réception/envoi</Label>
                  <p className="font-medium">{new Date(selectedMail.date).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
              {selectedMail.returnDate && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date de retour</Label>
                  <p className="font-medium">{new Date(selectedMail.returnDate).toLocaleDateString("fr-FR")}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                  <p>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedMail.status)}`}
                    >
                      {selectedMail.status}
                    </span>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Priorité</Label>
                  <p>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(selectedMail.priority)}`}
                    >
                      {selectedMail.priority}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="whitespace-pre-line rounded-md border p-2 bg-muted/30">{selectedMail.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Pièces jointes</Label>
                <div className="space-y-2 mt-2">
                  {selectedMail.attachments.map((attachment: Attachment, index: number) => (
                    <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{attachment.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{attachment.size}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => safeCloseDialog(setIsViewDialogOpen)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Déplacer le focus avant de fermer le dialogue
            document.body.focus()
            safeCloseDialog(setIsEditDialogOpen)
          } else {
            setIsEditDialogOpen(open)
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px]" ref={editDialogRef}>
          <DialogHeader>
            <DialogTitle>Modifier le courrier</DialogTitle>
            <DialogDescription>Modifier les informations du courrier {selectedMail?.id}</DialogDescription>
          </DialogHeader>
          {selectedMail && (
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-id">N° de courrier</Label>
                    <Input id="edit-id" defaultValue={selectedMail.id} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Type</Label>
                    <Select defaultValue={selectedMail.type}>
                      <SelectTrigger id="edit-type">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entrant">Entrant</SelectItem>
                        <SelectItem value="Sortant">Sortant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-nature">Nature</Label>
                    <Select defaultValue={selectedMail.nature}>
                      <SelectTrigger id="edit-nature">
                        <SelectValue placeholder="Sélectionner une nature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Externe">Externe</SelectItem>
                        <SelectItem value="Interne">Interne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-subject">Objet</Label>
                  <Input id="edit-subject" defaultValue={selectedMail.subject} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-sender">Expéditeur</Label>
                    <Input id="edit-sender" defaultValue={selectedMail.sender} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-recipient">Destinataire</Label>
                    <Input id="edit-recipient" defaultValue={selectedMail.recipient} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-registration-date">Date d'enregistrement</Label>
                    <Input
                      id="edit-registration-date"
                      type="date"
                      defaultValue={selectedMail.registrationDate}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Date de réception/envoi</Label>
                    <Input id="edit-date" type="date" defaultValue={selectedMail.date} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-priority">Priorité</Label>
                    <Select defaultValue={selectedMail.priority}>
                      <SelectTrigger id="edit-priority">
                        <SelectValue placeholder="Sélectionner une priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-return-date">Date de retour</Label>
                    <Input id="edit-return-date" type="date" defaultValue={selectedMail.returnDate || ""} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="edit-status">Statut</Label>
                    <Select defaultValue={selectedMail.status}>
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Archivé">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-file">Nouvelle pièce jointe</Label>
                  <div className="flex items-center gap-2">
                    <Input id="edit-file" type="file" className="flex-1" />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" defaultValue={selectedMail.description} className="min-h-[80px]" />
                </div>

                <div className="space-y-2">
                  <Label>Pièces jointes actuelles</Label>
                  <div className="space-y-2">
                    {selectedMail.attachments.map((attachment: Attachment, index: number) => (
                      <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{attachment.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{attachment.size}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" type="button">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => safeCloseDialog(setIsEditDialogOpen)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer les modifications</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={isHistoryDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Déplacer le focus avant de fermer le dialogue
            document.body.focus()
            safeCloseDialog(setIsHistoryDialogOpen)
          } else {
            setIsHistoryDialogOpen(open)
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]" ref={historyDialogRef}>
          <DialogHeader>
            <DialogTitle>Historique du courrier</DialogTitle>
            <DialogDescription>Détails de création et modifications du courrier</DialogDescription>
          </DialogHeader>
          {selectedMail && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Informations de création</h3>
                <div className="rounded-md border p-3">
                  <p className="text-sm">
                    <span className="font-medium">Créé par:</span> {selectedMail.createdBy}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Date de création:</span> {selectedMail.createdAt}
                  </p>
                </div>
              </div>

              {selectedMail.modifiedBy && selectedMail.modifiedBy.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Historique des modifications</h3>
                  <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-muted-foreground/20">
                    {selectedMail.modifiedBy.map((modification, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-primary" />
                        <div>
                          <p className="text-sm font-medium">Modification par {modification.user}</p>
                          <p className="text-xs text-muted-foreground">{modification.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => safeCloseDialog(setIsHistoryDialogOpen)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="all" className="space-y-4 w-full">
        <TabsList>
          <TabsTrigger value="all">Tous les courriers</TabsTrigger>
          <TabsTrigger value="incoming">Courriers entrants</TabsTrigger>
          <TabsTrigger value="outgoing">Courriers sortants</TabsTrigger>
          <TabsTrigger value="in-progress">En cours</TabsTrigger>
          <TabsTrigger value="archived">Archivés</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Liste des courriers</CardTitle>
              <CardDescription>Tous les courriers archivés dans le système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher un courrier..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrer
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="end" side="bottom" sideOffset={5}>
                      <div className="grid grid-cols-3 gap-4" style={{ minWidth: "700px" }}>
                        <div className="space-y-2">
                          <Label htmlFor="filter-id">N° de courrier</Label>
                          <Input
                            id="filter-id"
                            placeholder="Filtrer par numéro"
                            value={filters.id}
                            onChange={(e) => setFilters({ ...filters, id: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="filter-type">Type</Label>
                          <Select
                            value={filters.type}
                            onValueChange={(value) => setFilters({ ...filters, type: value })}
                          >
                            <SelectTrigger id="filter-type">
                              <SelectValue placeholder="Tous les types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous</SelectItem>
                              <SelectItem value="Entrant">Entrant</SelectItem>
                              <SelectItem value="Sortant">Sortant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="filter-nature">Nature</Label>
                          <Select
                            value={filters.nature}
                            onValueChange={(value) => setFilters({ ...filters, nature: value })}
                          >
                            <SelectTrigger id="filter-nature">
                              <SelectValue placeholder="Toutes les natures" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Toutes</SelectItem>
                              <SelectItem value="Externe">Externe</SelectItem>
                              <SelectItem value="Interne">Interne</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="filter-subject">Objet</Label>
                          <Input
                            id="filter-subject"
                            placeholder="Filtrer par objet"
                            value={filters.subject}
                            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date d'enregistrement</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="filter-date-from" className="text-xs">
                                De
                              </Label>
                              <Input
                                id="filter-date-from"
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="filter-date-to" className="text-xs">
                                À
                              </Label>
                              <Input
                                id="filter-date-to"
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Date de réception/envoi</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="filter-reception-from" className="text-xs">
                                De
                              </Label>
                              <Input
                                id="filter-reception-from"
                                type="date"
                                value={filters.dateReceptionFrom}
                                onChange={(e) => setFilters({ ...filters, dateReceptionFrom: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="filter-reception-to" className="text-xs">
                                À
                              </Label>
                              <Input
                                id="filter-reception-to"
                                type="date"
                                value={filters.dateReceptionTo}
                                onChange={(e) => setFilters({ ...filters, dateReceptionTo: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Date de retour</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="filter-retour-from" className="text-xs">
                                De
                              </Label>
                              <Input
                                id="filter-retour-from"
                                type="date"
                                value={filters.dateRetourFrom}
                                onChange={(e) => setFilters({ ...filters, dateRetourFrom: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="filter-retour-to" className="text-xs">
                                À
                              </Label>
                              <Input
                                id="filter-retour-to"
                                type="date"
                                value={filters.dateRetourTo}
                                onChange={(e) => setFilters({ ...filters, dateRetourTo: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="filter-status">Statut</Label>
                          <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                          >
                            <SelectTrigger id="filter-status">
                              <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous</SelectItem>
                              <SelectItem value="En cours">En cours</SelectItem>
                              <SelectItem value="Archivé">Archivé</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="filter-priority">Priorité</Label>
                          <Select
                            value={filters.priority}
                            onValueChange={(value) => setFilters({ ...filters, priority: value })}
                          >
                            <SelectTrigger id="filter-priority">
                              <SelectValue placeholder="Toutes les priorités" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous</SelectItem>
                              <SelectItem value="Normal">Normal</SelectItem>
                              <SelectItem value="Urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Expéditeur - Sélection hiérarchique */}
                        <div className="space-y-2 col-span-3">
                          <Label>Expéditeur</Label>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Select value={filters.senderDivision} onValueChange={handleFilterSenderDivisionChange}>
                                  <SelectTrigger id="filter-sender-division">
                                    <SelectValue placeholder="Division" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {divisionsData.map((division) => (
                                      <SelectItem key={division.id} value={division.id}>
                                        {division.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Select
                                  disabled={!filters.showSenderDirection || !filters.senderDivision}
                                  value={filters.senderDirection}
                                  onValueChange={handleFilterSenderDirectionChange}
                                >
                                  <SelectTrigger id="filter-sender-direction">
                                    <SelectValue placeholder="Direction" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getFilterSenderAvailableDirections().map((direction) => (
                                      <SelectItem key={direction.id} value={direction.id}>
                                        {direction.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center gap-1">
                                  <Checkbox
                                    id="filter-show-sender-direction"
                                    checked={filters.showSenderDirection}
                                    onCheckedChange={(checked) =>
                                      setFilters({ ...filters, showSenderDirection: checked === true })
                                    }
                                    disabled={!filters.senderDivision}
                                  />
                                  <Label htmlFor="filter-show-sender-direction" className="text-xs">
                                    Direction
                                  </Label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Select
                                  disabled={!filters.showSenderSousDirection || !filters.senderDirection}
                                  value={filters.senderSousDirection}
                                  onValueChange={handleFilterSenderSousDirectionChange}
                                >
                                  <SelectTrigger id="filter-sender-sous-direction">
                                    <SelectValue placeholder="Sous-Direction" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getFilterSenderAvailableSousDirections().map((sousDirection) => (
                                      <SelectItem key={sousDirection.id} value={sousDirection.id}>
                                        {sousDirection.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center gap-1">
                                  <Checkbox
                                    id="filter-show-sender-sous-direction"
                                    checked={filters.showSenderSousDirection}
                                    onCheckedChange={(checked) =>
                                      setFilters({ ...filters, showSenderSousDirection: checked === true })
                                    }
                                    disabled={!filters.showSenderDirection || !filters.senderDirection}
                                  />
                                  <Label htmlFor="filter-show-sender-sous-direction" className="text-xs">
                                    Sous-Direction
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Destinataire - Sélection hiérarchique */}
                        <div className="space-y-2 col-span-3">
                          <Label>Destinataire</Label>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Select
                                  value={filters.recipientDivision}
                                  onValueChange={handleFilterRecipientDivisionChange}
                                >
                                  <SelectTrigger id="filter-recipient-division">
                                    <SelectValue placeholder="Division" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {divisionsData.map((division) => (
                                      <SelectItem key={division.id} value={division.id}>
                                        {division.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Select
                                  disabled={!filters.showRecipientDirection || !filters.recipientDivision}
                                  value={filters.recipientDirection}
                                  onValueChange={handleFilterRecipientDirectionChange}
                                >
                                  <SelectTrigger id="filter-recipient-direction">
                                    <SelectValue placeholder="Direction" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getFilterRecipientAvailableDirections().map((direction) => (
                                      <SelectItem key={direction.id} value={direction.id}>
                                        {direction.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center gap-1">
                                  <Checkbox
                                    id="filter-show-recipient-direction"
                                    checked={filters.showRecipientDirection}
                                    onCheckedChange={(checked) =>
                                      setFilters({ ...filters, showRecipientDirection: checked === true })
                                    }
                                    disabled={!filters.recipientDivision}
                                  />
                                  <Label htmlFor="filter-show-recipient-direction" className="text-xs">
                                    Direction
                                  </Label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Select
                                  disabled={!filters.showRecipientSousDirection || !filters.recipientDirection}
                                  value={filters.recipientSousDirection}
                                  onValueChange={handleFilterRecipientSousDirectionChange}
                                >
                                  <SelectTrigger id="filter-recipient-sous-direction">
                                    <SelectValue placeholder="Sous-Direction" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getFilterRecipientAvailableSousDirections().map((sousDirection) => (
                                      <SelectItem key={sousDirection.id} value={sousDirection.id}>
                                        {sousDirection.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center gap-1">
                                  <Checkbox
                                    id="filter-show-recipient-sous-direction"
                                    checked={filters.showRecipientSousDirection}
                                    onCheckedChange={(checked) =>
                                      setFilters({ ...filters, showRecipientSousDirection: checked === true })
                                    }
                                    disabled={!filters.showRecipientDirection || !filters.recipientDirection}
                                  />
                                  <Label htmlFor="filter-show-recipient-sous-direction" className="text-xs">
                                    Sous-Direction
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-3 flex justify-between pt-2">
                          <Button variant="outline" size="sm" onClick={resetFilters}>
                            Réinitialiser
                          </Button>
                          <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                            Appliquer
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>
              <div className="mt-4 rounded-md border w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          id="select-all"
                          onCheckedChange={handleSelectAll}
                          checked={filteredMails.length > 0 && selectedMails.length === filteredMails.length}
                        />
                      </TableHead>
                      <TableHead className="w-[100px]">N° de courrier</TableHead>
                      <TableHead>Objet</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Nature</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Date d'enregistrement</TableHead>
                      <TableHead>Expéditeur</TableHead>
                      <TableHead>Destinataire</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="h-24 text-center">
                          Aucun courrier trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMails.map((mail) => (
                        <TableRow key={mail.id} onClick={(e) => e.stopPropagation()}>
                          <TableCell>
                            <Checkbox
                              checked={selectedMails.includes(mail.id)}
                              onCheckedChange={() => handleSelectMail(mail.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{mail.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="truncate max-w-[150px]" title={mail.subject}>
                                {mail.subject}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{mail.type}</TableCell>
                          <TableCell>{mail.nature}</TableCell>
                          <TableCell>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(mail.priority)}`}
                            >
                              {mail.priority}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(mail.registrationDate).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell>
                            <span className="truncate max-w-[150px]" title={mail.sender}>
                              {mail.sender}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="truncate max-w-[150px]" title={mail.recipient}>
                              {mail.recipient}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(mail.status)}`}
                            >
                              {mail.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDropdownAction(() => openHistoryDialog(mail))}
                                      className="h-8 w-8"
                                    >
                                      <History className="h-4 w-4" />
                                      <span className="sr-only">Historique</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Voir l'historique</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      e.preventDefault()
                                    }}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  onCloseAutoFocus={(e) => e.preventDefault()}
                                  onEscapeKeyDown={() => setOpenDropdownId(null)}
                                  onInteractOutside={() => setOpenDropdownId(null)}
                                  onPointerDownOutside={() => setOpenDropdownId(null)}
                                >
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleDropdownAction(() => handleViewDetails(mail))}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Voir les détails
                                  </DropdownMenuItem>
                                  {isAdmin && (
                                    <DropdownMenuItem onClick={() => handleDropdownAction(() => openEditDialog(mail))}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Modifier
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDropdownAction(() => handleDownloadAttachments(mail))}
                                  >
                                    <Download className="mr-2 h-4 w-4" />
                                    Télécharger
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedMails.length > 0 ? (
                    <span>
                      {selectedMails.length} courrier(s) sélectionné(s) sur {filteredMails.length}
                    </span>
                  ) : (
                    <span>
                      Affichage de {filteredMails.length} sur {mails.length} courriers
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Précédent
                  </Button>
                  <Button variant="outline" size="sm">
                    Suivant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="incoming" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Courriers entrants</CardTitle>
              <CardDescription>Courriers reçus par votre département</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Filtrer par "Entrant"</h3>
                <p className="text-muted-foreground">Cette vue affichera uniquement les courriers entrants.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outgoing" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Courriers sortants</CardTitle>
              <CardDescription>Courriers envoyés par votre département</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Filtrer par "Sortant"</h3>
                <p className="text-muted-foreground">Cette vue affichera uniquement les courriers sortants.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="in-progress" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Courriers en cours</CardTitle>
              <CardDescription>Courriers en attente de traitement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Filtrer par "En cours"</h3>
                <p className="text-muted-foreground">
                  Cette vue affichera uniquement les courriers en cours de traitement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="archived" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Courriers archivés</CardTitle>
              <CardDescription>Courriers traités et archivés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Filtrer par "Archivé"</h3>
                <p className="text-muted-foreground">Cette vue affichera uniquement les courriers archivés.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
