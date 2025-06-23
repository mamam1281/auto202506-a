import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import RadioButton from './RadioButton';

const meta: Meta<typeof RadioButton> = {
  title: 'Components/RadioButton',
  component: RadioButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable radio button component with animations and neon glow effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the radio button is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio button is disabled',
    },
    label: {
      control: 'text',
      description: 'Label text for the radio button',
    },
    name: {
      control: 'text',
      description: 'Name attribute for the radio button group',
    },
    value: {
      control: 'text',
      description: 'Value of the radio button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story
export const Default: Story = {
  args: {
    name: 'default',
    value: 'option1',
    checked: false,
    label: 'Default Radio Button',
    onChange: () => {},
  },
};

export const Checked: Story = {
  args: {
    name: 'checked',
    value: 'option1',
    checked: true,
    label: 'Checked Radio Button',
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled',
    value: 'option1',
    checked: false,
    disabled: true,
    label: 'Disabled Radio Button',
    onChange: () => {},
  },
};

export const DisabledChecked: Story = {
  args: {
    name: 'disabled-checked',
    value: 'option1',
    checked: true,
    disabled: true,
    label: 'Disabled Checked Radio Button',
    onChange: () => {},
  },
};

export const WithoutLabel: Story = {
  args: {
    name: 'no-label',
    value: 'option1',
    checked: false,
    onChange: () => {},
  },
};

// Interactive demo with multiple radio buttons
export const RadioGroup: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState('option1');
    
    const options = [
      { value: 'option1', label: 'First Option' },
      { value: 'option2', label: 'Second Option' },
      { value: 'option3', label: 'Third Option' },
      { value: 'option4', label: 'Fourth Option (Disabled)', disabled: true },
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-[var(--font-size-h5)] font-semibold text-[var(--foreground)] mb-4">
          Choose an option:
        </h3>
        <div className="space-y-3">
          {options.map((option) => (
            <RadioButton
              key={option.value}
              name="demo-group"
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(value) => setSelectedValue(value)}
              label={option.label}
              disabled={option.disabled}
            />
          ))}
        </div>
        <div className="mt-6 p-4 bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--border)]">
          <p className="text-[var(--font-size-sm)] text-[var(--muted-foreground)]">
            Selected value: <strong className="text-[var(--color-purple-primary)]">{selectedValue}</strong>
          </p>
        </div>
      </div>
    );
  },
};

// Different sizes/styles demo
export const Variants: Story = {
  render: () => {
    const [values, setValues] = useState({
      small: 'small1',
      medium: 'medium1',
      large: 'large1',
    });

    return (
      <div className="space-y-8">
        {/* Small variant */}
        <div>
          <h4 className="text-[var(--font-size-body)] font-medium text-[var(--foreground)] mb-3">
            Small Style
          </h4>
          <div className="space-y-2">
            {['small1', 'small2', 'small3'].map((value) => (
              <RadioButton
                key={value}
                name="small-group"
                value={value}
                checked={values.small === value}
                onChange={(val) => setValues(prev => ({ ...prev, small: val }))}
                label={`Small Option ${value.slice(-1)}`}
                dotClassName="w-3 h-3"
                className="text-[var(--font-size-xs)]"
              />
            ))}
          </div>
        </div>

        {/* Medium variant (default) */}
        <div>
          <h4 className="text-[var(--font-size-body)] font-medium text-[var(--foreground)] mb-3">
            Medium Style (Default)
          </h4>
          <div className="space-y-2">
            {['medium1', 'medium2', 'medium3'].map((value) => (
              <RadioButton
                key={value}
                name="medium-group"
                value={value}
                checked={values.medium === value}
                onChange={(val) => setValues(prev => ({ ...prev, medium: val }))}
                label={`Medium Option ${value.slice(-1)}`}
              />
            ))}
          </div>
        </div>

        {/* Large variant */}
        <div>
          <h4 className="text-[var(--font-size-body)] font-medium text-[var(--foreground)] mb-3">
            Large Style
          </h4>
          <div className="space-y-3">
            {['large1', 'large2', 'large3'].map((value) => (
              <RadioButton
                key={value}
                name="large-group"
                value={value}
                checked={values.large === value}
                onChange={(val) => setValues(prev => ({ ...prev, large: val }))}
                label={`Large Option ${value.slice(-1)}`}
                dotClassName="w-6 h-6"
                className="text-[var(--font-size-body)]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
};
