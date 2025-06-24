import React from 'react';

export default function DashboardTestPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 heading-h1">Dashboard Test Page</h1>
      <p className="text-lg text-foreground mb-2">
        This page uses the main AppLayout (via LayoutWrapper).
      </p>
      <p className="text-md text-muted-foreground">
        You should see the AppHeader, Sidebar (on desktop), and BottomNavigationBar (on mobile).
        The cyber token balance in the header should be visible and sourced from Redux.
      </p>
      <div className="mt-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 heading-h2 text-primary">Sample Card {i + 1}</h2>
            <p className="text-card-foreground">
              This is some placeholder content within a card to demonstrate the layout.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
