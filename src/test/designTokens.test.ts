/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Read the real file: Vitest replaces CSS imports (even `?raw`) with an empty string.
const css = readFileSync(`${process.cwd()}/src/index.css`, 'utf8')

/** Reads a `--name: #rrggbb;` token from the design system CSS. */
function token(name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!match) throw new Error(`Token --${name} not found in index.css`)
  return match[1]
}

/** WCAG relative luminance of a #rrggbb colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio between two colours (1–21). */
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const WHITE = '#ffffff'
const AA_NORMAL_TEXT = 4.5

describe('design tokens', () => {
  it.each(['pending', 'overdue', 'completed', 'late', 'archived'])(
    'status colour "%s" is readable as text on white (WCAG AA ≥ 4.5:1)',
    (status) => {
      expect(contrast(token(`color-status-${status}`), WHITE)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
    },
  )

  it.each(['brand-600', 'brand-700', 'brand-800'])('white text on %s is readable (WCAG AA)', (shade) => {
    expect(contrast(token(`color-${shade}`), WHITE)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
  })

  it('defines the display and body fonts', () => {
    expect(css).toMatch(/--font-display:\s*'Bricolage Grotesque'/)
    expect(css).toMatch(/--font-sans:\s*'Plus Jakarta Sans'/)
  })

  it('turns animations off for people who prefer reduced motion', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-duration:\s*0\.01ms !important/)
  })

  it.each(['bg-gradient-brand', 'text-gradient-brand', 'glass', 'shadow-glow', 'shadow-card'])(
    'provides the %s utility',
    (utility) => {
      expect(css).toContain(`@utility ${utility} {`)
    },
  )

  it('contrast helper matches known WCAG values', () => {
    expect(contrast('#000000', WHITE)).toBeCloseTo(21, 0)
    expect(contrast('#777777', WHITE)).toBeCloseTo(4.48, 1)
  })
})
