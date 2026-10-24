import { render, screen } from '@testing-library/react'
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

    await user.selectOptions(screen.getByRole('combobox', { name: 'Preview dashboard as role' }), 'student')

    expect(screen.getByRole('heading', { name: 'Student dashboard' })).toBeInTheDocument()
    expect(screen.getByText(/personal academic, registration, timetable and confirmed account/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Results' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Human resources' })).not.toBeInTheDocument()
    expect(screen.getByText(/own account only/i)).toBeInTheDocument()
  })
})