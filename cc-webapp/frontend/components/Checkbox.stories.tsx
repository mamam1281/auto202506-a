import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',    docs: {
      description: {
        component: 'Checkbox 컴포넌트는 사용자의 단일 또는 다중 선택을 받는 체크박스입니다. 글래스모피즘 효과와 작은 크기로 현대적이고 미니멀한 디자인을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      description: '체크 여부',
      control: 'boolean',
    },
    label: {
      description: '체크박스 라벨',
      control: 'text',
    },
    disabled: {
      description: '비활성화 여부',
      control: 'boolean',
    },
    onChange: {
      description: '체크 상태 변경 시 호출되는 함수',
      action: 'onChange',
    },
    className: {
      description: '추가 CSS 클래스',
      control: 'text',
    },
    boxClassName: {
      description: '체크박스 박스에 적용할 CSS 클래스',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 인터랙티브 스토리를 위한 래퍼 컴포넌트
const CheckboxWrapper = ({ initialChecked = false, ...props }: any) => {
  const [checked, setChecked] = useState(initialChecked);
  
  return (
    <Checkbox
      {...props}
      checked={checked}
      onChange={(newChecked) => {
        setChecked(newChecked);
        action('onChange')(newChecked);
      }}
    />
  );
};

// 기본 스토리들
export const Default: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    label: '기본 체크박스',
    initialChecked: false,
  },
};

export const Checked: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    label: '체크된 상태',
    initialChecked: true,
  },
};

export const Disabled: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    label: '비활성화된 체크박스',
    disabled: true,
    initialChecked: false,
  },
};

export const DisabledChecked: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    label: '비활성화된 체크된 상태',
    disabled: true,
    initialChecked: true,
  },
};

export const WithoutLabel: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    initialChecked: false,
  },
};

export const LongLabel: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    label: '매우 긴 라벨 텍스트입니다. 이 라벨은 체크박스와 함께 어떻게 표시되는지 확인하기 위한 긴 텍스트입니다.',
    initialChecked: false,
  },
};

// 여러 체크박스 그룹 예시
export const MultipleCheckboxes: Story = {
  render: () => {
    const [preferences, setPreferences] = useState({
      notifications: true,
      marketing: false,
      updates: true,
      newsletter: false,
    });

    const handleChange = (key: keyof typeof preferences) => (checked: boolean) => {
      setPreferences(prev => ({
        ...prev,
        [key]: checked
      }));
      action(`${key} changed`)(checked);
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">사용자 환경설정</h3>
        <Checkbox
          name="notifications"
          checked={preferences.notifications}
          onChange={handleChange('notifications')}
          label="알림 받기"
        />
        <Checkbox
          name="marketing"
          checked={preferences.marketing}
          onChange={handleChange('marketing')}
          label="마케팅 이메일 수신"
        />
        <Checkbox
          name="updates"
          checked={preferences.updates}
          onChange={handleChange('updates')}
          label="업데이트 알림"
        />
        <Checkbox
          name="newsletter"
          checked={preferences.newsletter}
          onChange={handleChange('newsletter')}
          label="뉴스레터 구독"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '여러 체크박스를 그룹으로 사용하는 예시입니다.',
      },
    },
  },
};

// 심리 퀴즈 스타일 예시
export const PsychologyQuiz: Story = {
  render: () => {
    const [answers, setAnswers] = useState({
      answer1: false,
      answer2: false,
      answer3: false,
      answer4: false,
    });

    const handleAnswerChange = (key: keyof typeof answers) => (checked: boolean) => {
      setAnswers(prev => ({
        ...prev,
        [key]: checked
      }));
    };

    return (
      <div className="max-w-md space-y-4 p-6 bg-[var(--card)] rounded-lg">
        <h3 className="text-lg font-semibold mb-4">다음 중 당신의 성격과 맞는 것들을 선택하세요:</h3>
        <Checkbox
          checked={answers.answer1}
          onChange={handleAnswerChange('answer1')}
          label="새로운 사람들과 만나는 것을 좋아한다"
        />
        <Checkbox
          checked={answers.answer2}
          onChange={handleAnswerChange('answer2')}
          label="계획을 세우는 것보다 즉흥적인 것을 선호한다"
        />
        <Checkbox
          checked={answers.answer3}
          onChange={handleAnswerChange('answer3')}
          label="혼자 있는 시간이 필요하다"
        />
        <Checkbox
          checked={answers.answer4}
          onChange={handleAnswerChange('answer4')}
          label="감정보다는 논리적으로 판단한다"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '심리 퀴즈나 설문에서 사용하는 체크박스 예시입니다.',
      },
    },
  },
};

// 새로운 글래스모피즘 스타일 예시
export const ModernGlassmorphism: Story = {
  render: () => {
    const [options, setOptions] = useState({
      notifications: true,
      darkMode: false,
      autoSave: true,
      analytics: false,
    });

    const handleChange = (key: keyof typeof options) => (checked: boolean) => {
      setOptions(prev => ({
        ...prev,
        [key]: checked
      }));
    };

    return (
      <div className="min-h-[400px] p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl">
        <div className="max-w-sm mx-auto">
          <h3 className="text-white text-lg font-semibold mb-6 text-center">Settings</h3>
          <div className="space-y-4 p-6 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
            <Checkbox
              checked={options.notifications}
              onChange={handleChange('notifications')}
              label="Push Notifications"
            />
            <Checkbox
              checked={options.darkMode}
              onChange={handleChange('darkMode')}
              label="Dark Mode"
            />
            <Checkbox
              checked={options.autoSave}
              onChange={handleChange('autoSave')}
              label="Auto Save"
            />
            <Checkbox
              checked={options.analytics}
              onChange={handleChange('analytics')}
              label="Analytics"
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '글래스모피즘 배경에서 새로운 작은 크기의 체크박스 디자인을 보여주는 예시입니다.',
      },
    },
  },
};
