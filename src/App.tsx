//import "@fontsource/poppins/300.css"; // Light
//import "@fontsource/poppins/400.css"; // Regular
//import "@fontsource/poppins/700.css"; // Bold
//import "@fontsource/poppins/600.css"; // SemiBold
//import "@fontsource/poppins/800.css"; // ExtraBold
//import "@fontsource/poppins/200.css"; // ExtraLight
import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { LoginPage } from "@/pages/login"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Dashboard } from "@/pages/dashboard"
import { UsersPage } from "@/pages/users"
import { ProfilePage } from "@/pages/profile"
import { ArchivePage } from "@/pages/archive"
import { NotFoundPage } from "@/pages/not-found"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/archive" element={<ArchivePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  )
}

export default App