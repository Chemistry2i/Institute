import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ModulePlaceholderPage } from './components/shared/ModulePlaceholderPage'
import { LoadingSpinner } from './components/shared/LoadingSpinner'
import { RouteErrorBoundary } from './components/shared/RouteErrorBoundary'
import { navigationItems } from './config/navigation'
import { hasAnyPermission } from './config/access'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { AcademicRegistrarWorkspacePage } from './features/registrar/AcademicRegistrarWorkspacePage'
import type { AppShellContext } from './components/layout/AppShell'

function ScopedModuleRoute({ item }: { item: (typeof navigationItems)[number] }) {
  const { roleId } = useOutletContext<AppShellContext>()
  const isAllowed = hasAnyPermission(roleId, item.permissions)

  if (!isAllowed) {
    return <Navigate to="/" replace />
  }

  return roleId === 'academicRegistrar'
    ? <AcademicRegistrarWorkspacePage item={item} />
    : <ModulePlaceholderPage title={item.label} />
}

function ScopedSettingsRoute() {
  const { roleId } = useOutletContext<AppShellContext>()
  const settingsItem = navigationItems.find((item) => item.path === '/settings')
  const isAllowed = settingsItem !== undefined && hasAnyPermission(roleId, settingsItem.permissions)

  return isAllowed ? <SettingsPage /> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<LoadingSpinner label="Loading page" />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="settings" element={<ScopedSettingsRoute />} />
            {navigationItems
              .filter((item) => item.path !== '/' && item.path !== '/settings')
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
      </Suspense>
    </RouteErrorBoundary>
  )
}
