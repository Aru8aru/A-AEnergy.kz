import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home     from './pages/Home'
import Admin    from './pages/Admin'
import Operator from './pages/Operator'

// ─── Защищённый маршрут ───────────────────────────────────────────────────────
// USERS = { admin:{role:'admin'}, operator:{role:'operator'} }
// localStorage сохраняет роль как 'admin' или 'operator' (маленькими)
// Поэтому пути /admin и /operator — тоже маленькими
function ProtectedRoute({ children, requiredRole }) {
  const role = localStorage.getItem('qmg_role')   // 'admin' или 'operator'
  const user = localStorage.getItem('qmg_user')   // 'admin' или 'operator'

  // Не залогинен → на главную
  if (!role || !user) {
    return <Navigate to="/" replace />
  }

  // Залогинен с другой ролью → на свою панель
  if (role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/admin' : '/operator'} replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Главная страница */}
        <Route path="/" element={<Home />} />

        {/* Админ панель: role === 'admin' → /admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Оператор панель: role === 'operator' → /operator */}
        <Route
          path="/operator"
          element={
            <ProtectedRoute requiredRole="operator">
              <Operator />
            </ProtectedRoute>
          }
        />

        {/* Всё остальное → главная */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App