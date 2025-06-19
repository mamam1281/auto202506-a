import React, { useState } from 'react';
import styles from './Calendar.module.css';

export interface CalendarProps {
  /** 선택된 날짜 */
  selectedDate?: Date;
  
  /** 날짜 선택 핸들러 */
  onDateSelect?: (date: Date) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const calendarClassNames = [styles.calendar, className].filter(Boolean).join(' ');

  return (
    <div className={calendarClassNames}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth} className={styles.navButton}>‹</button>
        <h2 className={styles.title}>
          {currentDate.toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long' 
          })}
        </h2>
        <button onClick={handleNextMonth} className={styles.navButton}>›</button>
      </div>
      
      <div className={styles.weekdays}>
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>
      
      <div className={styles.grid}>
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className={styles.emptyDay} />
        ))}
        {days.map(day => (
          <button
            key={day}
            onClick={() => handleDateClick(day)}
            className={`${styles.day} ${isSelectedDate(day) ? styles.selected : ''}`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
