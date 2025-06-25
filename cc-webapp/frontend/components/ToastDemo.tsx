import React, { useState } from 'react';
import Toast, { ToastType } from './Toast';

const demoToasts: { id: string; message: string; type: ToastType }[] = [
  { id: '1', message: '성공적으로 저장되었습니다!', type: 'success' },
  { id: '2', message: '에러가 발생했습니다.', type: 'error' },
  { id: '3', message: '정보를 확인하세요.', type: 'info' },
  { id: '4', message: '경고: 제한에 도달했습니다.', type: 'warning' },
  { id: '5', message: '일반 메시지입니다.', type: 'default' },
];

const ToastDemo: React.FC = () => {
  const [toasts, setToasts] = useState(demoToasts);

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 max-w-xs mx-auto mt-8">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={handleClose} duration={0} />
      ))}
    </div>
  );
};

export default ToastDemo;
