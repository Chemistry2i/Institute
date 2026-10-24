import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'

async function openRegistrarPage(pathLabel: string) {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )

  await user.click(await screen.findByRole('combobox', { name: 'Preview dashboard as role' }))
  await user.click(screen.getByRole('option', { name: 'Academic Registrar' }))
  const navigation = within(await screen.findByRole('navigation', { name: 'Main navigation' }))
  await user.click(navigation.getByRole('link', { name: pathLabel }))

  return user
}

describe('Academic Registrar workspace controls', () => {
  it('supports local filter and sort controls without inventing records', async () => {
    const user = await openRegistrarPage('Admissions')

    expect(screen.getByRole('heading', { level: 1, name: 'Admissions review' })).toBeInTheDocument()
    expect(screen.getByText('No applications loaded')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Record decision' })).toBeDisabled()

    await user.type(screen.getByRole('searchbox', { name: 'Search Application queue' }), 'app-100')
    expect(screen.getAllByText('No matching records')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByText('No applications loaded')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sort by Application' }))
    expect(screen.getByRole('columnheader', { name: 'Application' })).toHaveAttribute('aria-sort', 'ascending')
    await user.click(screen.getByRole('button', { name: 'Sort by Application' }))
    expect(screen.getByRole('columnheader', { name: 'Application' })).toHaveAttribute('aria-sort', 'descending')

    expect(screen.getByText('No records loaded')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('opens the workflow outline in an accessible dialog', async () => {
    const user = await openRegistrarPage('Registration')

    await user.click(screen.getByRole('button', { name: 'View workflow' }))

    expect(screen.getByRole('dialog', { name: 'Registration management workflow' })).toBeInTheDocument()
    expect(screen.getByText(/institution policy and the authorized backend control actual transitions/i)).toBeInTheDocument()
    expect(screen.getByRole('list')).toHaveTextContent('Eligibility review')

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not enable report export before authorized report data is connected', async () => {
    const user = await openRegistrarPage('Reports')

    expect(screen.getByRole('heading', { level: 1, name: 'Registrar reports' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled()

    await user.click(screen.getByRole('combobox', { name: 'Export format' }))
    await user.click(screen.getByRole('option', { name: 'PDF' }))
    expect(screen.getByRole('combobox', { name: 'Export format' })).toHaveTextContent('PDF')
  })
})