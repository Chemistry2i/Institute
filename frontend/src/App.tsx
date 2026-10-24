import { Navigate, Route, Routes } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ModulePlaceholderPage } from './components/shared/ModulePlaceholderPage'
import { navigationItems } from './config/navigation'
import { hasAnyPermission } from './config/access'
import { DashboardPage } from './features/dashboard/DashboardPage'
import type { AppShellContext } from './components/layout/AppShell'

function ScopedModuleRoute({ item }: { item: (typeof navigationItems)[number] }) {
  const { roleId } = useOutletContext<AppShellContext>()
  const isAllowed = hasAnyPermission(roleId, item.permissions)

  return isAllowed ? <ModulePlaceholderPage title={item.label} /> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        {navigationItems
          .filter((item) => item.path !== '/')
          .map((item) => (
            <Route
              key={item.path}
              path={item.path.slice(1)}
              element={<ScopedModuleRoute item={item} />}
            />
          ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
