import type { Meta, StoryObj } from '@storybook/react';
import { CustomProgress, CustomCircularProgress, CustomSpinner } from './CustomProgress';
import React, { useState, useEffect } from 'react';

const meta: Meta<typeof CustomProgress> = {
  title: 'Components/Progress',
  component: CustomProgress,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'project-dark',
      values: [
        { name: 'project-dark', value: 'var(--color-primary-dark-navy)' },
        { name: 'project-charcoal', value: 'var(--color-primary-charcoal)' },
        { name: 'project-gradient', value: 'var(--gradient-dark)' },
      ],
    },
    docs: {
      description: {
        component: `
📊 **프로그레스 컴포넌트 세트**

다양한 형태의 진행률 표시 컴포넌트들입니다.

### 포함된 컴포넌트
- **CustomProgress**: 선형 프로그레스 바
- **CustomCircularProgress**: 원형 프로그레스
- **CustomSpinner**: 로딩 스피너

### 특징
- 3가지 크기 옵션 (sm, md, lg)
- 결정적/비결정적 애니메이션
- 프로젝트 색상 시스템 사용 (보라색 그라데이션)
- 라벨 및 퍼센트 표시 옵션
- 부드러운 애니메이션 효과

### 사용 예시
\`\`\`tsx
<CustomProgress 
  value={75} 
  size="lg" 
  showLabel={true} 
  label="다운로드 진행률" 
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '진행률 값 (0-100)',
    },
    type: {
      control: { type: 'select' },
      options: ['determinate', 'indeterminate'],
      description: '프로그레스 타입',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '프로그레스 바 크기',
    },
    animated: {
      control: { type: 'boolean' },
      description: '애니메이션 효과 활성화',
    },
    showLabel: {
      control: { type: 'boolean' },
      description: '라벨 표시 여부',
    },
    label: {
      control: { type: 'text' },
      description: '프로그레스 라벨 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 🎯 Linear Progress Stories
export const Default: Story = {
  args: {
    value: 50,
    size: 'md',
    animated: true,
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    size: 'lg',
    showLabel: true,
    label: '파일 다운로드',
  },
  parameters: {
    docs: {
      description: {
        story: '라벨과 퍼센트가 표시되는 프로그레스 바입니다.',
      },
    },
  },
};

export const Indeterminate: Story = {
  args: {
    type: 'indeterminate',
    size: 'md',
    showLabel: true,
    label: '로딩 중...',
  },
  parameters: {
    docs: {
      description: {
        story: '진행률을 알 수 없을 때 사용하는 무한 애니메이션 프로그레스입니다.',
      },
    },
  },
};

// 🎯 크기별 비교
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div>
        <h4 className="text-sm font-medium text-white mb-2">Small (sm)</h4>
        <CustomProgress value={30} size="sm" showLabel={true} label="Small Progress" />
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-white mb-2">Medium (md)</h4>
        <CustomProgress value={60} size="md" showLabel={true} label="Medium Progress" />
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-white mb-2">Large (lg)</h4>
        <CustomProgress value={90} size="lg" showLabel={true} label="Large Progress" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 크기 옵션을 비교해서 볼 수 있습니다.',
      },
    },
  },
};

// 🎯 Circular Progress Stories
export const CircularDefault: Story = {
  render: () => (
    <CustomCircularProgress value={75} showLabel={true} />
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 원형 프로그레스입니다.',
      },
    },
  },
};

export const CircularSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center space-y-2">
        <CustomCircularProgress value={25} size={60} strokeWidth={6} showLabel={true} />
        <p className="text-xs text-white/70">Small (60px)</p>
      </div>
      
      <div className="text-center space-y-2">
        <CustomCircularProgress value={50} size={80} strokeWidth={8} showLabel={true} />
        <p className="text-xs text-white/70">Medium (80px)</p>
      </div>
      
      <div className="text-center space-y-2">
        <CustomCircularProgress value={75} size={120} strokeWidth={10} showLabel={true} />
        <p className="text-xs text-white/70">Large (120px)</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기의 원형 프로그레스입니다.',
      },
    },
  },
};

// 🎯 Spinner Stories
export const SpinnerVariants: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center space-y-2">
        <CustomSpinner size="sm" />
        <p className="text-xs text-white/70">Small</p>
      </div>
      
      <div className="text-center space-y-2">
        <CustomSpinner size="md" />
        <p className="text-xs text-white/70">Medium</p>
      </div>
      
      <div className="text-center space-y-2">
        <CustomSpinner size="lg" />
        <p className="text-xs text-white/70">Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기의 로딩 스피너입니다.',
      },
    },
  },
};

// 🎯 애니메이션 데모
export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            return 0;
          }
          return prevProgress + 1;
        });
      }, 100);
      
      return () => {
        clearInterval(timer);
      };
    }, []);
    
    return (
      <div className="w-80 space-y-6">
        <CustomProgress 
          value={progress} 
          size="lg" 
          showLabel={true} 
          label="자동 진행 데모" 
        />
        
        <CustomCircularProgress 
          value={progress} 
          size={100} 
          showLabel={true} 
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '자동으로 진행되는 애니메이션 데모입니다.',
      },
    },
  },
};

// 🎯 실제 사용 시나리오
export const RealWorldScenarios: Story = {
  render: () => {
    const [downloadProgress, setDownloadProgress] = useState(65);
    const [uploadProgress, setUploadProgress] = useState(30);
    const [syncProgress, setSyncProgress] = useState(90);
    
    return (
      <div className="space-y-8 p-6 max-w-lg">
        {/* 파일 다운로드 */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">파일 다운로드</h3>
          <CustomProgress 
            value={downloadProgress} 
            size="md" 
            showLabel={true} 
            label="video_file.mp4" 
          />
          <div className="flex justify-between items-center mt-2 text-xs text-white/60">
            <span>325 MB / 500 MB</span>
            <span>2분 남음</span>
          </div>
        </div>
        
        {/* 파일 업로드 */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">파일 업로드</h3>
          <CustomProgress 
            value={uploadProgress} 
            size="md" 
            showLabel={true} 
            label="document.pdf" 
          />
          <div className="flex justify-between items-center mt-2 text-xs text-white/60">
            <span>15 MB / 50 MB</span>
            <span>업로드 중...</span>
          </div>
        </div>
        
        {/* 동기화 진행률 */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">클라우드 동기화</h3>
          <div className="flex items-center gap-4">
            <CustomCircularProgress 
              value={syncProgress} 
              size={60} 
              strokeWidth={6} 
              showLabel={true} 
            />
            <div>
              <p className="text-white font-medium">거의 완료됨</p>
              <p className="text-white/60 text-sm">파일 450개 중 405개 동기화됨</p>
            </div>
          </div>
        </div>
        
        {/* 로딩 상태 */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">데이터 처리 중</h3>
          <div className="flex items-center gap-4">
            <CustomSpinner size="lg" />
            <div>
              <CustomProgress 
                type="indeterminate" 
                size="md" 
                showLabel={true} 
                label="서버에서 데이터 가져오는 중..." 
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '실제 앱에서 사용될 수 있는 다양한 프로그레스 시나리오들입니다.',
      },
    },
  },
};

// 🎯 모든 컴포넌트 비교
export const AllComponents: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
      {/* Linear Progress */}
      <div className="text-center space-y-4">
        <h4 className="text-base font-medium text-white">Linear Progress</h4>
        <div className="space-y-3">
          <CustomProgress value={25} size="sm" />
          <CustomProgress value={50} size="md" showLabel={true} label="Medium" />
          <CustomProgress value={75} size="lg" showLabel={true} label="Large" />
          <CustomProgress type="indeterminate" size="md" />
        </div>
      </div>
      
      {/* Circular Progress */}
      <div className="text-center space-y-4">
        <h4 className="text-base font-medium text-white">Circular Progress</h4>
        <div className="space-y-4 flex flex-col items-center">
          <CustomCircularProgress value={30} size={60} showLabel={true} />
          <CustomCircularProgress value={60} size={80} showLabel={true} />
          <CustomCircularProgress value={90} size={100} showLabel={true} />
        </div>
      </div>
      
      {/* Spinners */}
      <div className="text-center space-y-4">
        <h4 className="text-base font-medium text-white">Spinners</h4>
        <div className="space-y-4 flex flex-col items-center">
          <CustomSpinner size="sm" />
          <CustomSpinner size="md" />
          <CustomSpinner size="lg" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 프로그레스 컴포넌트들을 한눈에 비교해서 볼 수 있습니다.',
      },
    },
  },
};
