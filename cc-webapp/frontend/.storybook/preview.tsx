import '../app/globals.css'; // 글로벌 스타일을 Storybook에 적용
import { Provider } from 'react-redux';
import { store } from '../store/store'; // store의 실제 위치에 맞게 경로 수정

export const decorators = [
  (Story) => (
    <Provider store={store}>
      <Story />
    </Provider>
  ),
];
