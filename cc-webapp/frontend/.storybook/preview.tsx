// 모든 스타일이 올바른 순서로 로드되도록 합니다
import '../styles/global.css'; // 먼저 기본 컴포넌트 스타일 로드
import '../app/globals.css'; // 그 다음 앱 전체 스타일 로드
import './tailwind-inject.css'; // Tailwind 클래스 명시적 주입
import { Provider } from 'react-redux';
import { store } from '../store/store'; // store의 실제 위치에 맞게 경로 수정

export const decorators = [
  (Story) => (
    <Provider store={store}>
      <Story />
    </Provider>
  ),
];

export const parameters = {
  viewport: {
    defaultViewport: 'iphone13',
    viewports: {
      iphone13: {
        name: 'iPhone 13',
        styles: {
          width: '390px',
          height: '844px',
        },
        type: 'mobile',
      },
    },
  },
};
