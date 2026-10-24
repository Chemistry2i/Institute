import { describe, expect, it } from 'vitest'
import { getNavigationForRole, hasPermission } from './access'

describe('role-based access configuration', () => {
  it('limits student navigation to self-service workspaces', () => {
    const paths = getNavigationForRole('student').map((item) => item.path)

    expect(paths).toContain('/results')
    expect(paths).toContain('/finance')
    expect(paths).not.toContain('/admissions')
    expect(paths).not.toContain('/hr')
    expect(paths).not.toContain('/welfare')
  })

  it('allows lecturers to submit marks but not approve results by default', () => {
    expect(hasPermission('lecturer', 'results.enter')).toBe(true)
    expect(hasPermission('lecturer', 'results.approve')).toBe(false)
    expect(getNavigationForRole('lecturer').map((item) => item.path)).toContain('/results')
  })

  it('keeps finance permissions separate from academic result changes', () => {
    expect(hasPermission('financeManager', 'finance.approve')).toBe(true)
    expect(hasPermission('financeManager', 'results.correct')).toBe(false)
  })
})