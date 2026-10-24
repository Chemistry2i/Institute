import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoadingSpinner } from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('announces loading and renders a centered Bootstrap spinner', () => {
    render(<LoadingSpinner label="Loading dashboard" />)

    expect(screen.getByRole('status', { name: 'Loading dashboard' })).toHaveClass('loading-screen')
    expect(document.querySelector('.spinner-border')).toBeInTheDocument()
  })
})