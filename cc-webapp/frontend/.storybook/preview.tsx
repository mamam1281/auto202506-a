import '../app/globals.css'; // 글로벌 스타일을 Storybook에 적용
import '../styles/global.css'; // BottomNavigationBar 등의 컴포넌트 스타일 포함
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
