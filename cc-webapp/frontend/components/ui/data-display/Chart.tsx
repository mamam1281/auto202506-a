import React from 'react';
import styles from './Chart.module.css';

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  /** 차트 타입 */
  type: ChartType;
  
  /** 차트 데이터 */
  data: ChartDataPoint[];
  
  /** 차트 제목 */
  title?: string;
  
  /** X축 레이블 */
  xAxisLabel?: string;
  
  /** Y축 레이블 */
  yAxisLabel?: string;
  
  /** 그리드 표시 */
  showGrid?: boolean;
  
  /** 범례 표시 */
  showLegend?: boolean;
  
  /** 애니메이션 여부 */
  animated?: boolean;
  
  /** 차트 높이 */
  height?: number;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  // xAxisLabel,
  // yAxisLabel,
  showGrid = true,
  showLegend = true,
  animated = true,
  height = 300,
  className = ''
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  // const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`;

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 100;
  };

  const getPieAngle = (value: number, total: number) => {
    return (value / total) * 360;
  };

  const renderLineChart = () => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - getBarHeight(point.value);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className={styles.chartSvg} style={{ height }}>
        {showGrid && (
          <g className={styles.grid}>
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} />
            ))}
          </g>
        )}
        <polyline
          className={`${styles.line} ${animated ? styles.animated : ''}`}
          points={points}
          fill="none"
        />
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - getBarHeight(point.value);
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r="4"
              className={styles.point}
            />
          );
        })}
      </svg>
    );
  };

  const renderBarChart = () => {
    return (
      <div className={styles.barChart} style={{ height }}>
        {showGrid && (
          <div className={styles.gridLines}>
            {[0, 25, 50, 75, 100].map(y => (
              <div key={y} className={styles.gridLine} style={{ bottom: `${y}%` }} />
            ))}
          </div>
        )}
        {data.map((point, index) => (
          <div key={index} className={styles.barContainer}>
            <div
              className={`${styles.bar} ${animated ? styles.animated : ''}`}
              style={{
                height: `${getBarHeight(point.value)}%`,
                backgroundColor: point.color || 'var(--neon-purple-1)',
                animationDelay: animated ? `${index * 0.1}s` : '0s'
              }}
            />
            <span className={styles.barLabel}>{point.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, point) => sum + point.value, 0);
    let currentAngle = 0;

    return (
      <div className={styles.pieChartContainer} style={{ height }}>
        <svg className={styles.pieChart} viewBox="0 0 100 100">
          {data.map((point, index) => {
            const angle = getPieAngle(point.value, total);
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
            const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M 50 50`,
              `L ${startX} ${startY}`,
              `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={point.color || `hsl(${(index * 360) / data.length}, 70%, 60%)`}
                className={`${styles.pieSlice} ${animated ? styles.animated : ''}`}
                style={{ animationDelay: animated ? `${index * 0.1}s` : '0s' }}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
      case 'area':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
      case 'doughnut':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className={`${styles.chart} ${className}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      
      <div className={styles.chartContainer}>
        {renderChart()}
      </div>

      {showLegend && (
        <div className={styles.legend}>
          {data.map((point, index) => (
            <div key={index} className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{
                  backgroundColor: point.color || `hsl(${(index * 360) / data.length}, 70%, 60%)`
                }}
              />
              <span className={styles.legendLabel}>{point.label}: {point.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chart;
