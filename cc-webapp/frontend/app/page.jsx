// cc-webapp/frontend/app/page.jsx (example for App Router)
'use client'; // Required for event handlers and hooks in App Router components

import { useRouter } from 'next/navigation'; // For redirection in App Router
// Assuming apiClient is configured in utils/apiClient.js
// import apiClient from '@/utils/apiClient'; // Adjust path if needed
import axios from 'axios'; // Or use apiClient

export default function HomePage() {
  const router = useRouter();
  // Placeholder for user_id. In a real app, this would come from auth context/state.
  const userId = 1;

  const handleVisitHQ = async () => {
    try {
      const payload = { user_id: userId, source: "webapp_hq_button" }; // More specific source
      // Adjust baseURL if apiClient is not used or not configured for http://localhost:8000
      // Using direct URL as per subtask instructions for now
      await axios.post('http://localhost:8000/api/notify/site_visit', payload);
      console.log('Site visit logged for user:', userId);

      // Redirect to corporate site
      const corporateSiteUrl = `https://corporate-site.example.com/welcome?userId=${userId}`;

      // For external URLs, direct assignment is often simplest and most reliable.
      // Using window.location.assign to mimic a click an allow going back to the webapp.
      // router.push() is more for internal navigation.
      window.location.assign(corporateSiteUrl);

    } catch (error) {
      console.error('Failed to log site visit or redirect:', error);
      // Handle error appropriately in UI if needed, e.g., show a message to the user
      alert('Could not process your request to visit the HQ site. Please try again later.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>CC Webapp – Welcome!</h1>
      {/* Other content for the homepage can go here */}
      <p>Explore our features and engage with our platform.</p>
      <button
        onClick={handleVisitHQ}
        style={{
          marginTop: '20px',
          padding: '10px 15px',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px'
        }}
      >
        Visit HQ Site
      </button>
    </div>
  );
}
