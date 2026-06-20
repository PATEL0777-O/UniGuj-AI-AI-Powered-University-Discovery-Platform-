import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Universities } from '@/pages/Universities'
import { Compare } from '@/pages/Compare'
import { Chat } from '@/pages/Chat'
import { Scholarships } from '@/pages/Scholarships'
import { Placements } from '@/pages/Placements'
import { Dashboard } from '@/pages/Dashboard'
import { useAuthStore } from '@/stores/authStore'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/universities" element={<Universities />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/scholarships" element={<Scholarships />} />
      <Route path="/placements" element={<Placements />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
