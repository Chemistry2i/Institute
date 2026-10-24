import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'

describe('scoped institution settings', () => {
  it('limits the institution head to institution profile and structure settings', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    await user.click(within(await screen.findByRole('navigation', { name: 'Main navigation' })).getByRole('link', { name: 'Settings' }))

    expect(screen.getByRole('heading', { name: 'Institution identity and structure' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Academic settings' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Finance settings' })).not.toBeInTheDocument()
  })

  it('shows finance controls to finance managers and labels drafts as session-only', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('combobox', { name: 'Preview dashboard as role' }))
    await user.click(screen.getByRole('option', { name: 'Finance Manager / Bursar' }))
    await user.click(within(await screen.findByRole('navigation', { name: 'Main navigation' })).getByRole('link', { name: 'Settings' }))
    await user.click(screen.getByRole('combobox', { name: 'Default currency' }))
    await user.click(screen.getByRole('option', { name: 'UGX' }))
    await user.click(screen.getByRole('button', { name: 'Save session draft' }))

    expect(screen.getByRole('heading', { name: 'Finance settings' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Institution identity and structure' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Draft updated for this session only.')
  })
})