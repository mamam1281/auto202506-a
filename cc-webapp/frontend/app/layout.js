// cc-webapp/frontend/app/layout.js
'use client'; // Required if RootLayout itself uses client-side hooks or state

import { GeistSans } from 'geist/font/sans'; // Updated import for Geist font
import { GeistMono } from 'geist/font/mono';
import './globals.css'; // Your global styles

// export const metadata = { // Metadata API is for Server Components
//   title: 'CC Webapp',
//   description: 'Emotion-driven gamified adult-content webapp',
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Default Next.js head elements will be here. Add custom ones if needed. */}
        {/* For App Router, title/description are better in page.js or layout.js metadata export */}
        <title>CC Webapp</title>
        <meta name="description" content="Emotion-driven gamified adult-content webapp" />
      </head>
      <body className="antialiased bg-gray-100 dark:bg-gray-900"> {/* Added basic body bg */}
        {/* Add padding-top to main content area if banner is fixed and has a known height.
            The banner is ~52px high (p-3 + text-sm + icon). Let's use pt-16 to be safe.
            Alternatively, the banner could push content down if not fixed.
            Current banner is fixed top-4, so it overlays. Main content needs top padding.
        */}
        <main className="pt-20"> {/* pt-20 to account for banner height + top-4 offset */}
          {children}
        </main>
      </body>
    </html>
  );
}
