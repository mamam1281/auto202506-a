import '@testing-library/jest-dom'

// Mock canvas-confetti for testing
jest.mock('canvas-confetti', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Mock use-sound for testing
jest.mock('use-sound', () => ({
  __esModule: true,
  default: jest.fn(() => [jest.fn(), { stop: jest.fn() }]),
}))

// Mock framer-motion for testing
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    h1: 'h1',
    button: 'button',
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Setup global mocks
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.confirm
global.confirm = jest.fn(() => true)