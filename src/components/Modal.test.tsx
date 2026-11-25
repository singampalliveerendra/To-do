import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders into document.body, not inside its parent', () => {
    // A parent with backdrop-filter would otherwise trap `position: fixed` children.
    render(
      <header data-testid="parent" style={{ backdropFilter: 'blur(4px)' }}>
        <Modal open title="Hello" onClose={vi.fn()}>
          <input aria-label="Name" />
        </Modal>
      </header>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Hello' })
    expect(screen.getByTestId('parent')).not.toContainElement(dialog)
    expect(dialog.closest('body')).toBe(document.body)
  })

  it('renders nothing when closed', () => {
    render(
      <Modal open={false} title="Hidden" onClose={vi.fn()}>
        content
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('focuses the first field when opened', () => {
    render(
      <Modal open title="Form" onClose={vi.fn()}>
        <input aria-label="First" />
        <input aria-label="Second" />
      </Modal>,
    )
    expect(screen.getByLabelText('First')).toHaveFocus()
  })
})
