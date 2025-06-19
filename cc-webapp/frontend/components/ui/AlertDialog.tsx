import React from 'react';
import styles from './AlertDialog.module.css';

export interface AlertDialogProps {
  /** 열림 상태 */
  open: boolean;
  
  /** 닫기 핸들러 */
  onClose: () => void;
  
  /** 확인 핸들러 */
  onConfirm: () => void;
  
  /** 제목 */
  title: string;
  
  /** 설명 */
  description?: string;
  
  /** 확인 버튼 텍스트 */
  confirmText?: string;
  
  /** 취소 버튼 텍스트 */
  cancelText?: string;
  
  /** 위험한 액션 여부 */
  destructive?: boolean;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  destructive = false,
  className = ''
}) => {
  if (!open) return null;

  const dialogClassNames = [
    styles.dialog,
    className
  ].filter(Boolean).join(' ');

  const confirmButtonClassNames = [
    styles.confirmButton,
    destructive ? styles.destructive : styles.default
  ].join(' ');

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={dialogClassNames}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            {cancelText}
          </button>
          <button className={confirmButtonClassNames} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
