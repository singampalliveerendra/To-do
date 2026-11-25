import { describe, expect, it } from 'vitest'
import { completionPercent, getGreeting, getMotivation } from './greeting'

const at = (hour: number, minute = 0) => new Date(2026, 10, 25, hour, minute)

describe('getGreeting', () => {
  it.each([
    [5, 'Good morning'],
    [11, 'Good morning'],
    [12, 'Good afternoon'],
    [16, 'Good afternoon'],
    [17, 'Good evening'],
    [21, 'Good evening'],
    [22, 'Hello, night owl'],
    [0, 'Hello, night owl'],
    [4, 'Hello, night owl'],
  ])('at %i:00 says "%s"', (hour, expected) => {
    expect(getGreeting(at(hour))).toBe(expected)
  })

  it('switches exactly on the hour boundary', () => {
    expect(getGreeting(at(11, 59))).toBe('Good morning')
    expect(getGreeting(at(12, 0))).toBe('Good afternoon')
  })
})

describe('getMotivation', () => {
  it('encourages a first task when there are none', () => {
    expect(getMotivation(0, 0)).toMatch(/fresh start/i)
  })
  it('celebrates when everything is done', () => {
    expect(getMotivation(0, 3)).toMatch(/Everything is done/)
  })
  it('uses singular and plural correctly', () => {
    expect(getMotivation(1, 0)).toMatch(/^1 task is waiting/)
    expect(getMotivation(4, 0)).toMatch(/^4 tasks are waiting/)
  })
  it('shows progress when some are done', () => {
    expect(getMotivation(2, 3)).toBe('2 to go, 3 done. Keep the momentum going!')
  })
})

describe('completionPercent', () => {
  it.each([
    [0, 0, 0],
    [1, 0, 0],
    [0, 4, 100],
    [2, 1, 33],
    [1, 2, 67],
  ])('pending %i + completed %i → %i%%', (pending, completed, expected) => {
    expect(completionPercent(pending, completed)).toBe(expected)
  })
})
