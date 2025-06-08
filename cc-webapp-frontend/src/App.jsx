import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API 연결 테스트
    async function fetchData() {
      try {
        setLoading(true);
        // 백엔드에 맞게 경로 조정 필요
        const response = await apiService.get('/api/status');
        setData(response);
        setError(null);
      } catch (err) {
        console.error("API 연결 오류:", err);
        setError("백엔드 서버에 연결할 수 없습니다.");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Casino-Club F2P</h1>
        <p>OpenAI/Codex 최적화 버전</p>
      </header>
      
      <main>
        <section className="status-section">
          <h2>백엔드 연결 상태</h2>
          {loading && <p>로딩 중...</p>}
          {error && <p className="error">{error}</p>}
          {data && <p className="success">백엔드 연결 성공!</p>}
        </section>
      </main>

      <footer>
        <p>&copy; 2025 Casino-Club F2P</p>
      </footer>
    </div>
  );
}

export default App;
