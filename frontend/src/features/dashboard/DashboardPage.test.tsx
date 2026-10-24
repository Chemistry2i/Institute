import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'

describe('role dashboard preview', () => {
  it('shows the selected role responsibilities and scoped navigation', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('combobox', { name: 'Preview dashboard as role' }))
    await user.click(screen.getByRole('option', { name: 'Student' }))

    expect(screen.getByRole('heading', { name: 'Student dashboard' })).toBeInTheDocument()
    expect(screen.getByText(/personal academic, registration, timetable and confirmed account/i)).toBeInTheDocument()
    expect(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('link', { name: 'Results' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Human resources' })).not.toBeInTheDocument()
    expect(screen.getByText(/own account only/i)).toBeInTheDocument()
  })

  it('renders the Super Administrator dashboard with quick actions and empty analytics', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('combobox', { name: 'Preview dashboard as role' }))
    await user.click(screen.getByRole('option', { name: 'Super Administrator' }))

    expect(await screen.findByRole('heading', { name: 'Super Administrator dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Configure institution settings/ })).toHaveAttribute('href', '/settings')
    expect(await screen.findByText('No activity data yet')).toBeInTheDocument()
  })

  it('collapses the sidebar on desktop and exposes its expanded state', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('button', { name: 'Collapse sidebar' }))

    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('complementary').parentElement).toHaveClass('is-sidebar-collapsed')
  })
})