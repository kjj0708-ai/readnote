import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import LibraryPage from './pages/LibraryPage'
import NoteDetail from './components/Note/NoteDetail'

function RootRedirect() {
  const { user, loading } = useAuth()

  // OAuth 콜백: URL 해시에 토큰이 있으면 Supabase가 처리할 때까지 대기
  if (loading || window.location.hash.includes('access_token')) return null

  return <Navigate to={user ? '/library' : '/login'} replace />
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <NoteDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
