"use client"

import type React from "react"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect, useRef } from "react"
import { Copy, Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Types for our data
interface User {
  id: string
  name: string
  email: string
  phone: string
  department: string
  profession: string
  lastLogin: string
  createdAt: string
  password: string
  pin: string
}

interface NewUser {
  name: string
  email: string
  phone: string
  department: string
  profession: string
  useDivision: boolean
  useDirection: boolean
  useSousDirection: boolean
  password: string
  pin: string
}

// Sample data for users
const users: User[] = [
  {
    id: "USR-001",
    name: "Mohammed Tazi",
    email: "mohammed.tazi@finances.gov.ma",
    phone: "+212 661-234567",
    department: "Direction des Marchés Publics",
    profession: "Directeur",
    lastLogin: "2023-03-25T10:30:00",
    createdAt: "2022-05-15T08:45:00",
    password: "Tazi2023!",
    pin: "1234",
  },
  {
    id: "USR-002",
    name: "Fatima Zahra",
    email: "fatima.zahra@finances.gov.ma",
    phone: "+212 662-345678",
    department: "Division du Budget",
    profession: "Chef de division",
    lastLogin: "2023-03-24T14:15:00",
    createdAt: "2022-06-20T09:30:00",
    password: "Zahra2023!",
    pin: "5678",
  },
  {
    id: "USR-003",
    name: "Ahmed Benali",
    email: "ahmed.benali@finances.gov.ma",
    phone: "+212 663-456789",
    department: "Sous-Direction des Finances",
    profession: "Sous-directeur",
    lastLogin: "2023-03-23T09:45:00",
    createdAt: "2022-07-10T11:20:00",
    password: "Benali2023!",
    pin: "9012",
  },
  {
    id: "USR-004",
    name: "Karim Alaoui",
    email: "karim.alaoui@finances.gov.ma",
    phone: "+212 664-567890",
    department: "Division de la réglementation budgétaire",
    profession: "Analyste financier",
    lastLogin: "2023-03-20T16:30:00",
    createdAt: "2022-08-05T10:15:00",
    password: "Alaoui2023!",
    pin: "3456",
  },
  {
    id: "USR-005",
    name: "Nadia Mansouri",
    email: "nadia.mansouri@finances.gov.ma",
    phone: "+212 665-678901",
    department: "Direction des Ressources Humaines",
    profession: "Responsable RH",
    lastLogin: "2023-03-18T11:20:00",
    createdAt: "2022-09-12T14:40:00",
    password: "Mansouri2023!",
    pin: "7890",
  },
]

// Departments data
const divisions = ["Division de la réglementation budgétaire", "Division du Budget", "Division des Marchés Publics"]
const directions = [
  "Direction Générale",
  "Direction des Ressources Humaines",
  "Direction des Affaires Administratives",
  "Direction des Marchés Publics",
]
const sousDirections = ["Sous-Direction des Finances", "Sous-Direction de la Comptabilité", "Sous-Direction des Achats"]

// Ajoutez une fonction pour gérer le focus dans les menus déroulants
const handleDropdownAction = (action: () => void) => {
  // Déplacer le focus vers le body avant d'exécuter l'action
  document.body.focus()

  // Exécuter l'action après un court délai
  setTimeout(() => {
    action()
  }, 10)
}

export function UsersPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState("admin") // Default to admin for demo
  const [generatedPassword, setGeneratedPassword] = useState("")
  const passwordRef = useRef<HTMLParagraphElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)

  // State for PIN input
  const [pin1, setPin1] = useState("")
  const [pin2, setPin2] = useState("")
  const [pin3, setPin3] = useState("")
  const [pin4, setPin4] = useState("")

  // Refs for PIN input fields
  const pin1Ref = useRef<HTMLInputElement>(null)
  const pin2Ref = useRef<HTMLInputElement>(null)
  const pin3Ref = useRef<HTMLInputElement>(null)
  const pin4Ref = useRef<HTMLInputElement>(null)

  // State for new user form
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    phone: "",
    department: "",
    profession: "",
    useDivision: false,
    useDirection: false,
    useSousDirection: false,
    password: "",
    pin: "",
  })

  const [newUserDept, setNewUserDept] = useState<string>("")

  // Refs for dialogs to prevent UI blocking
  const viewDialogRef = useRef<HTMLDivElement>(null)
  const editDialogRef = useRef<HTMLDivElement>(null)
  const deleteDialogRef = useRef<HTMLDivElement>(null)
  const addDialogRef = useRef<HTMLDivElement>(null)

  // Modifiez la fonction safeCloseDialog pour gérer correctement le focus
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

  useEffect(() => {
    // Get user role from localStorage (in a real app, this would come from a session)
    const role = localStorage.getItem("userRole") || "admin"
    setUserRole(role)
  }, [])

  // Effect to filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const result = users.filter(
        (user) =>
          user.id.toLowerCase().includes(term) ||
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.department.toLowerCase().includes(term),
      )
      setFilteredUsers(result)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm])

  // Generate a random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  // Handle PIN input change
  const handlePinChange = (value: string, field: string, nextField: React.RefObject<HTMLInputElement> | null) => {
    if (value.length <= 1) {
      if (field === "pin1") setPin1(value)
      else if (field === "pin2") setPin2(value)
      else if (field === "pin3") setPin3(value)
      else if (field === "pin4") setPin4(value)

      // Move to next field if value is entered
      if (value.length === 1 && nextField && nextField.current) {
        nextField.current.focus()
      }
    }
  }

  // Copy text to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copié !",
          description: `${type} copié dans le presse-papiers.`,
        })
      },
      (err) => {
        toast({
          title: "Erreur",
          description: "Impossible de copier le texte.",
          variant: "destructive",
        })
      },
    )
  }

  const handleAddUser = () => {
    // Generate password and PIN
    const password = generatePassword()
    const pin = Math.floor(1000 + Math.random() * 9000).toString()

    // In a real app, this would send the data to the backend
    toast({
      title: "Utilisateur ajouté",
      description: `${newUser.name} a été ajouté avec succès.`,
    })

    safeCloseDialog(setShowAddDialog)
    // Reset form
    setNewUser({
      name: "",
      email: "",
      phone: "",
      department: "",
      profession: "",
      useDivision: false,
      useDirection: false,
      useSousDirection: false,
      password: "",
      pin: "",
    })
  }

  const handleEditUser = () => {
    // In a real app, this would send the data to the backend
    if (currentUser) {
      toast({
        title: "Utilisateur modifié",
        description: `${currentUser.name} a été modifié avec succès.`,
      })
    }
    safeCloseDialog(setShowEditDialog)
  }

  const handleDeleteUser = () => {
    // In a real app, this would send the data to the backend
    if (currentUser) {
      toast({
        title: "Utilisateur supprimé",
        description: `${currentUser.name} a été supprimé avec succès.`,
      })
    }
    safeCloseDialog(setShowDeleteDialog)
  }

  const handleViewUser = (user: User) => {
    setCurrentUser(user)
    setShowViewDialog(true)
  }

  const handleEditClick = (user: User) => {
    setCurrentUser(user)
    setShowEditDialog(true)

    // Set PIN values
    if (user.pin && user.pin.length === 4) {
      setPin1(user.pin[0])
      setPin2(user.pin[1])
      setPin3(user.pin[2])
      setPin4(user.pin[3])
    }
  }

  const handleDeleteClick = (user: User) => {
    setCurrentUser(user)
    setShowDeleteDialog(true)
  }

  // Check if user is active based on last login (inactive if not logged in for 3 days)
  const isUserActive = (lastLogin: string) => {
    const lastLoginDate = new Date(lastLogin)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    return lastLoginDate >= threeDaysAgo
  }

  // Check if user can edit/delete based on role
  const canManageUsers = userRole === "admin"

  const departments = [
    {
      id: "1",
      name: "Finance",
      services: [
        { id: "1-1", name: "Comptabilité", departmentId: "1" },
        { id: "1-2", name: "Budget", departmentId: "1" },
        { id: "1-3", name: "Audit", departmentId: "1" },
      ],
    },
    {
      id: "2",
      name: "Ressources Humaines",
      services: [
        { id: "2-1", name: "Recrutement", departmentId: "2" },
        { id: "2-2", name: "Formation", departmentId: "2" },
        { id: "2-3", name: "Paie", departmentId: "2" },
      ],
    },
    {
      id: "3",
      name: "Informatique",
      services: [
        { id: "3-1", name: "Développement", departmentId: "3" },
        { id: "3-2", name: "Infrastructure", departmentId: "3" },
        { id: "3-3", name: "Support", departmentId: "3" },
      ],
    },
    {
      id: "4",
      name: "Marketing",
      services: [
        { id: "4-1", name: "Communication", departmentId: "4" },
        { id: "4-2", name: "Événements", departmentId: "4" },
        { id: "4-3", name: "Digital", departmentId: "4" },
      ],
    },
    {
      id: "5",
      name: "Opérations",
      services: [
        { id: "5-1", name: "Logistique", departmentId: "5" },
        { id: "5-2", name: "Production", departmentId: "5" },
        { id: "5-3", name: "Qualité", departmentId: "5" },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canManageUsers && (
            <Dialog
              open={showAddDialog}
              onOpenChange={(open) => {
                if (!open) {
                  // Déplacer le focus avant de fermer le dialogue
                  document.body.focus()
                  safeCloseDialog(setShowAddDialog)
                } else {
                  setShowAddDialog(open)
                }
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel Utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]" ref={addDialogRef}>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                  <DialogDescription>Remplissez les informations de l'utilisateur ci-dessous.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet*</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Nom et prénom"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email*</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="exemple@finances.gov.ma"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="+212 6XX-XXXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={newUser.profession}
                      onChange={(e) => setNewUser({ ...newUser, profession: e.target.value })}
                      placeholder="Poste ou fonction"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="flex gap-2">
                      <Input
                        id="password"
                        type="text"
                        value={newUser.password || generatedPassword}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Mot de passe"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const password = generatePassword()
                          setGeneratedPassword(password)
                          setNewUser({ ...newUser, password })
                        }}
                      >
                        Générer
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pin">Code PIN (4 chiffres)</Label>
                    <div className="flex gap-2 justify-between">
                      <Input
                        ref={pin1Ref}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg"
                        value={pin1}
                        onChange={(e) => handlePinChange(e.target.value, "pin1", pin2Ref)}
                      />
                      <Input
                        ref={pin2Ref}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg"
                        value={pin2}
                        onChange={(e) => handlePinChange(e.target.value, "pin2", pin3Ref)}
                      />
                      <Input
                        ref={pin3Ref}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg"
                        value={pin3}
                        onChange={(e) => handlePinChange(e.target.value, "pin3", pin4Ref)}
                      />
                      <Input
                        ref={pin4Ref}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg"
                        value={pin4}
                        onChange={(e) => handlePinChange(e.target.value, "pin4", null)}
                      />
                    </div>
                  </div>

                  <div className="col-span-2 space-y-4">
                    <Label>Département</Label>

                    <div className="space-y-4">
                      <div className="flex flex-row items-center space-x-2">
                        <Checkbox
                          id="useDivision"
                          checked={newUser.useDivision}
                          onCheckedChange={(checked) => setNewUser({ ...newUser, useDivision: checked === true })}
                        />
                        <label
                          htmlFor="useDivision"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Division
                        </label>
                      </div>
                      {newUser.useDivision && (
                        <Select
                          value={newUser.department}
                          onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                        >
                          <SelectTrigger id="division">
                            <SelectValue placeholder="Sélectionner une division" />
                          </SelectTrigger>
                          <SelectContent>
                            {divisions.map((division) => (
                              <SelectItem key={division} value={division}>
                                {division}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      <div className="flex flex-row items-center space-x-2">
                        <Checkbox
                          id="useDirection"
                          checked={newUser.useDirection}
                          onCheckedChange={(checked) => setNewUser({ ...newUser, useDirection: checked === true })}
                        />
                        <label
                          htmlFor="useDirection"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Direction
                        </label>
                      </div>
                      {newUser.useDirection && (
                        <Select
                          value={newUser.department}
                          onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                        >
                          <SelectTrigger id="direction">
                            <SelectValue placeholder="Sélectionner une direction" />
                          </SelectTrigger>
                          <SelectContent>
                            {directions.map((direction) => (
                              <SelectItem key={direction} value={direction}>
                                {direction}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      <div className="flex flex-row items-center space-x-2">
                        <Checkbox
                          id="useSousDirection"
                          checked={newUser.useSousDirection}
                          onCheckedChange={(checked) => setNewUser({ ...newUser, useSousDirection: checked === true })}
                        />
                        <label
                          htmlFor="useSousDirection"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Sous-Direction
                        </label>
                      </div>
                      {newUser.useSousDirection && (
                        <Select
                          value={newUser.department}
                          onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                        >
                          <SelectTrigger id="sousDirection">
                            <SelectValue placeholder="Sélectionner une sous-direction" />
                          </SelectTrigger>
                          <SelectContent>
                            {sousDirections.map((sousDirection) => (
                              <SelectItem key={sousDirection} value={sousDirection}>
                                {sousDirection}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {!newUser.useDivision && !newUser.useDirection && !newUser.useSousDirection && (
                        <Input
                          id="department"
                          value={newUser.department}
                          onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                          placeholder="Département"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => safeCloseDialog(setShowAddDialog)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur{filteredUsers.length !== 1 && "s"} trouvé
            {filteredUsers.length !== 1 && "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge variant={isUserActive(user.lastLogin) ? "default" : "outline"}>
                        {isUserActive(user.lastLogin) ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleDropdownAction(() => handleViewUser(user))}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir le profil
                          </DropdownMenuItem>
                          {canManageUsers && (
                            <>
                              <DropdownMenuItem onClick={() => handleDropdownAction(() => handleEditClick(user))}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDropdownAction(() => handleDeleteClick(user))}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog
        open={showViewDialog}
        onOpenChange={(open) => {
          if (!open) {
            // Déplacer le focus avant de fermer le dialogue
            document.body.focus()
            safeCloseDialog(setShowViewDialog)
          } else {
            setShowViewDialog(open)
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]" ref={viewDialogRef}>
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
            <DialogDescription>Informations complètes du profil</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{currentUser.name}</h3>
                <Badge variant={isUserActive(currentUser.lastLogin) ? "default" : "outline"}>
                  {isUserActive(currentUser.lastLogin) ? "Actif" : "Inactif"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                  <p>{currentUser.phone || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Département</p>
                  <p>{currentUser.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profession</p>
                  <p>{currentUser.profession || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dernière connexion</p>
                  <p>{new Date(currentUser.lastLogin).toLocaleString("fr-FR")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date de création</p>
                  <p>{new Date(currentUser.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mot de passe</p>
                  <div className="flex items-center gap-2">
                    <p ref={passwordRef} className="font-mono bg-muted p-1 rounded">
                      {currentUser.password}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(currentUser.password, "Mot de passe")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Code PIN</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2" ref={pinRef}>
                      {currentUser.pin.split("").map((digit, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 flex items-center justify-center bg-muted rounded font-mono"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(currentUser.pin, "Code PIN")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => safeCloseDialog(setShowViewDialog)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          if (!open) {
            // Déplacer le focus avant de fermer le dialogue
            document.body.focus()
            safeCloseDialog(setShowEditDialog)
          } else {
            setShowEditDialog(open)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]" ref={editDialogRef}>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>Modifiez les informations de l'utilisateur ci-dessous.</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom complet*</Label>
                <Input
                  id="edit-name"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  placeholder="Nom et prénom"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email*</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  placeholder="exemple@finances.gov.ma"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Téléphone</Label>
                <Input
                  id="edit-phone"
                  value={currentUser.phone}
                  onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                  placeholder="+212 6XX-XXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-profession">Profession</Label>
                <Input
                  id="edit-profession"
                  value={currentUser.profession}
                  onChange={(e) => setCurrentUser({ ...currentUser, profession: e.target.value })}
                  placeholder="Poste ou fonction"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-password">Mot de passe</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-password"
                    type="text"
                    value={currentUser.password}
                    onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const password = generatePassword()
                      setCurrentUser({ ...currentUser, password })
                    }}
                  >
                    Générer
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-pin">Code PIN (4 chiffres)</Label>
                <div className="flex gap-2 justify-between">
                  <Input
                    ref={pin1Ref}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg"
                    value={pin1}
                    onChange={(e) => handlePinChange(e.target.value, "pin1", pin2Ref)}
                  />
                  <Input
                    ref={pin2Ref}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg"
                    value={pin2}
                    onChange={(e) => handlePinChange(e.target.value, "pin2", pin3Ref)}
                  />
                  <Input
                    ref={pin3Ref}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg"
                    value={pin3}
                    onChange={(e) => handlePinChange(e.target.value, "pin3", pin4Ref)}
                  />
                  <Input
                    ref={pin4Ref}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg"
                    value={pin4}
                    onChange={(e) => handlePinChange(e.target.value, "pin4", null)}
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-department">Département</Label>
                <div className="space-y-4">
                  <div className="flex flex-row items-center space-x-2">
                    <Checkbox id="edit-useDivision" checked={currentUser.department.includes("Division")} />
                    <label
                      htmlFor="edit-useDivision"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Division
                    </label>
                  </div>
                  {currentUser.department.includes("Division") && (
                    <Select
                      value={currentUser.department}
                      onValueChange={(value) => setCurrentUser({ ...currentUser, department: value })}
                    >
                      <SelectTrigger id="edit-division">
                        <SelectValue placeholder="Sélectionner une division" />
                      </SelectTrigger>
                      <SelectContent>
                        {divisions.map((division) => (
                          <SelectItem key={division} value={division}>
                            {division}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <div className="flex flex-row items-center space-x-2">
                    <Checkbox id="edit-useDirection" checked={currentUser.department.includes("Direction")} />
                    <label
                      htmlFor="edit-useDirection"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Direction
                    </label>
                  </div>
                  {currentUser.department.includes("Direction") && (
                    <Select
                      value={currentUser.department}
                      onValueChange={(value) => setCurrentUser({ ...currentUser, department: value })}
                    >
                      <SelectTrigger id="edit-direction">
                        <SelectValue placeholder="Sélectionner une direction" />
                      </SelectTrigger>
                      <SelectContent>
                        {directions.map((direction) => (
                          <SelectItem key={direction} value={direction}>
                            {direction}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <div className="flex flex-row items-center space-x-2">
                    <Checkbox id="edit-useSousDirection" checked={currentUser.department.includes("Sous-Direction")} />
                    <label
                      htmlFor="edit-useSousDirection"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sous-Direction
                    </label>
                  </div>
                  {currentUser.department.includes("Sous-Direction") && (
                    <Select
                      value={currentUser.department}
                      onValueChange={(value) => setCurrentUser({ ...currentUser, department: value })}
                    >
                      <SelectTrigger id="edit-sousDirection">
                        <SelectValue placeholder="Sélectionner une sous-direction" />
                      </SelectTrigger>
                      <SelectContent>
                        {sousDirections.map((sousDirection) => (
                          <SelectItem key={sousDirection} value={sousDirection}>
                            {sousDirection}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {!currentUser.department.includes("Division") &&
                    !currentUser.department.includes("Direction") &&
                    !currentUser.department.includes("Sous-Direction") && (
                      <Input
                        id="edit-department-custom"
                        value={currentUser.department}
                        onChange={(e) => setCurrentUser({ ...currentUser, department: e.target.value })}
                        placeholder="Département"
                      />
                    )}
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-status">Statut</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={isUserActive(currentUser.lastLogin) ? "default" : "outline"}>
                    {isUserActive(currentUser.lastLogin) ? "Actif" : "Inactif"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Le statut est déterminé automatiquement en fonction de la dernière connexion
                  </p>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-created-at">Date de création</Label>
                <Input id="edit-created-at" value={new Date(currentUser.createdAt).toLocaleString("fr-FR")} disabled />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => safeCloseDialog(setShowEditDialog)}>
              Annuler
            </Button>
            <Button onClick={handleEditUser}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (!open) {
            // Déplacer le focus avant de fermer le dialogue
            document.body.focus()
            safeCloseDialog(setShowDeleteDialog)
          } else {
            setShowDeleteDialog(open)
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]" ref={deleteDialogRef}>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="py-4">
              <p className="text-center font-medium">
                {currentUser.name} ({currentUser.email})
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => safeCloseDialog(setShowDeleteDialog)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
