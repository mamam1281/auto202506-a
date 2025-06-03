// jest.setup.js
import '@testing-library/jest-dom'; // Extends Jest with custom matchers for DOM elements

// You can add other global setups here, for example:
// - Mocking global objects (localStorage, fetch)
// - Setting up a global server for MSW (Mock Service Worker)
// - Global test timeouts if needed

// Example: Mocking localStorage
// const localStorageMock = (function() {
//   let store = {};
//   return {
//     getItem: function(key) {
//       return store[key] || null;
//     },
//     setItem: function(key, value) {
//       store[key] = value.toString();
//     },
//     removeItem: function(key) {
//       delete store[key];
//     },
//     clear: function() {
//       store = {};
//     }
//   };
// })();
// Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Example: Basic mock for next/navigation's useRouter
// This is a very basic mock. For more complex navigation testing, you might need a more detailed one.
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    // Add other router properties/methods if your components use them
    // pathname: '/',
    // query: {},
    // asPath: '/',
    // events: {
    //   on: jest.fn(),
    //   off: jest.fn(),
    //   emit: jest.fn(),
    // },
  }),
  usePathname: () => '/', // Example pathname
  useSearchParams: () => new URLSearchParams(), // Example search params
}));

// Mock canvas confetti as it might not work well in JSDOM
jest.mock('canvas-confetti', () => ({
  __esModule: true, // This is important for ES modules
  default: jest.fn(), // Default export mock
  // If it also has named exports that are used, mock them too:
  // create: jest.fn().mockReturnValue(jest.fn()),
}));

// Mock useSound hook as it involves audio elements not well supported in JSDOM
jest.mock('use-sound', () => ({
    __esModule: true,
    default: jest.fn(() => [jest.fn(), { stop: jest.fn(), isPlaying: false }]), // Returns a mock play function and controls object
}));
