import type React from "react"
// Types pour l'application de gestion de courriers

// Types utilisateur
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  status: UserStatus
  avatar?: string
  createdAt: Date
}

export type UserRole = "admin" | "manager" | "user"
export type UserStatus = "active" | "inactive" | "pending"

// Types pour les courriers
export interface Mail {
  id: string
  number: string
  subject: string
  type: MailType
  nature: MailNature
  priority: MailPriority
  registrationDate: Date
  sender: Sender
  recipient: Recipient
  status: MailStatus
  attachments?: Attachment[]
  comments?: Comment[]
  history?: HistoryEntry[]
}

export type MailType = "Entrant" | "Sortant" | "Interne"
export type MailNature = "Administratif" | "Financier" | "Technique" | "Juridique" | "Autre"
export type MailPriority = "Urgent" | "Haute" | "Normale" | "Basse"
export type MailStatus = "Nouveau" | "En traitement" | "Traité" | "Archivé" | "En attente"

// Types pour les expéditeurs et destinataires
export interface Sender {
  type: EntityType
  name: string
  department?: string
  service?: string
}

export interface Recipient {
  type: EntityType
  name: string
  department?: string
  service?: string
}

export type EntityType = "Interne" | "Externe" | "Particulier"

// Types pour les pièces jointes
export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

// Types pour les commentaires
export interface Comment {
  id: string
  text: string
  author: User
  createdAt: Date
}

// Types pour l'historique
export interface HistoryEntry {
  id: string
  action: string
  user: User
  timestamp: Date
  details?: string
}

// Types pour les départements et services
export interface Department {
  id: string
  name: string
  services: Service[]
}

export interface Service {
  id: string
  name: string
  departmentId: string
}

// Types pour les filtres
export interface MailFilters {
  search?: string
  type?: MailType[]
  nature?: MailNature[]
  priority?: MailPriority[]
  status?: MailStatus[]
  dateRange?: {
    from?: Date
    to?: Date
  }
  sender?: {
    type?: EntityType
    name?: string
    department?: string
    service?: string
  }
  recipient?: {
    type?: EntityType
    name?: string
    department?: string
    service?: string
  }
}

// Types pour les états des dialogues
export interface DialogState {
  open: boolean
  type?: string
  data?: unknown
}

// Types pour les états des formulaires
export interface FormState {
  loading: boolean
  error: string | null
  success: boolean
}

// Types pour les statistiques
export interface MailStats {
  total: number
  byType: Record<MailType, number>
  byStatus: Record<MailStatus, number>
  byPriority: Record<MailPriority, number>
}

export interface DepartmentStats {
  department: string
  count: number
  percentage: number
}

// Types pour les tableaux
export interface Column {
  id: string
  header: string
  accessorKey?: string
  cell?: (info: unknown) => React.ReactNode
}

// Types pour les sélections hiérarchiques
export interface HierarchicalSelection {
  type: EntityType | null
  department: string | null
  service: string | null
}
