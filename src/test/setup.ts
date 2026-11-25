import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

// Every test starts with empty browser storage.
beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
})
