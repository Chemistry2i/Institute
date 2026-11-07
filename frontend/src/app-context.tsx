import { createContext, useContext, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { roles, type Permission, type RoleName } from './data'

export type ThemeMode = 'light' | 'dark'
export type ThemeColors = Record<'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info', string>

export const defaultColors: ThemeColors = {
  primary: '#174A84',
  secondary: '#16856B',
  success: '#15803D',
  warning: '#B45309',
  danger: '#B91C1C',
  info: '#0369A1',
}

interface AppContextValue {
  role: RoleName
  setRole: (role: RoleName) => void
  colors: ThemeColors
  setColors: (colors: ThemeColors) => void
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  can: (permission: Permission) => boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used inside AppProvider')
  return context
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleName>('Super Administrator')
  const [mode, setMode] = useState<ThemeMode>(() => (localStorage.getItem('tims-mode') as ThemeMode) || 'light')
  const [colors, setColors] = useState<ThemeColors>(() => {
    const stored = localStorage.getItem('tims-colors')
    return stored ? { ...defaultColors, ...JSON.parse(stored) as Partial<ThemeColors> } : defaultColors
  })

  useEffect(() => { localStorage.setItem('tims-mode', mode) }, [mode])
  useEffect(() => { localStorage.setItem('tims-colors', JSON.stringify(colors)) }, [colors])

  const currentRole = roles.find((item) => item.name === role) ?? roles[0]
  const value = useMemo<AppContextValue>(() => ({ role, setRole, colors, setColors, mode, setMode, can: (permission) => currentRole.permissions.includes(permission) }), [colors, currentRole.permissions, mode, role])
  const rootStyle = { '--primary': colors.primary, '--secondary': colors.secondary, '--success': colors.success, '--warning': colors.warning, '--danger': colors.danger, '--info': colors.info } as CSSProperties

  return <AppContext.Provider value={value}><div className={`app-root ${mode === 'dark' ? 'theme-dark' : ''}`} style={rootStyle}>{children}</div></AppContext.Provider>
}
