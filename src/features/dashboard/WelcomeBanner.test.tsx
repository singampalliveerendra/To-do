import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WelcomeBanner } from './WelcomeBanner'

const afternoon = new Date(2026, 10, 25, 14, 0)

describe('WelcomeBanner', () => {
  it('greets by time of day', () => {
    render(<WelcomeBanner pending={0} completed={0} now={afternoon} />)
    expect(screen.getByRole('heading', { name: /Good afternoon!/ })).toBeInTheDocument()
  })

  it('describes progress for screen readers via the ring', () => {
    render(<WelcomeBanner pending={3} completed={1} now={afternoon} />)
    expect(screen.getByRole('img', { name: '1 of 4 tasks completed (25%)' })).toBeInTheDocument()
    expect(screen.getByTestId('motivation')).toHaveTextContent('3 to go, 1 done.')
  })

  it('celebrates when everything is done', () => {
    render(<WelcomeBanner pending={0} completed={2} now={afternoon} />)
    expect(screen.getByRole('img', { name: '2 of 2 tasks completed (100%)' })).toBeInTheDocument()
    expect(screen.getByTestId('motivation')).toHaveTextContent(/Everything is done/)
  })

  it('invites a first task when empty', () => {
    render(<WelcomeBanner pending={0} completed={0} now={afternoon} />)
    expect(screen.getByRole('img', { name: '0 of 0 tasks completed (0%)' })).toBeInTheDocument()
    expect(screen.getByTestId('motivation')).toHaveTextContent(/fresh start/i)
  })
})
