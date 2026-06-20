import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(cleanup)

describe('activity navigation', () => {
  it('opens the focused Pair activity with one base and one shape', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Pair' }))

    expect(screen.getByRole('heading', { name: 'Pair' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: / base$/ })).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: / shape$/ })).toHaveLength(1)
    expect(screen.getByText(/Pair 1 of 12/)).toBeInTheDocument()
  })

  it('opens Build a Mat with twelve completed tiles and twelve targets', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Build a mat' }))

    expect(screen.getByRole('heading', { name: 'Build a mat' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Completed/ })).toHaveLength(12)
    expect(container.querySelectorAll('.target-slot')).toHaveLength(12)
  })

  it('opens Make Something and starts the selected House wireframe', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Make something' }))

    expect(screen.getByRole('heading', { name: 'Make something' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Make something' })).toHaveAttribute('aria-pressed', 'true')
    const dialog = screen.getByRole('dialog', { name: 'Make something!' })
    fireEvent.click(within(dialog).getByRole('button', { name: 'House' }))

    expect(screen.getByRole('heading', { name: 'House' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Completed/ })).toHaveLength(12)
    expect(container.querySelector('.build-guide.house')).toBeInTheDocument()
  })
})
