'use client';

import { useState } from 'react';
import Button from '../../components/ui/basic/Button';

const ButtonDemoPage = () => {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Button Component Demo</h1>
        
        {/* Click Counter */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-4">Click Counter</h2>
          <div data-testid="click-counter" className="text-2xl text-green-400 mb-4">
            Clicks: {clickCount}
          </div>
          <Button 
            data-testid="button-clickable" 
            onClick={handleClick}
            variant="primary"
          >
            Click Me!
          </Button>
        </div>

        {/* Button Variants */}
        <div data-testid="button-variants-container" className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-4">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button data-testid="button-primary" variant="primary">Primary</Button>
            <Button data-testid="button-secondary" variant="secondary">Secondary</Button>
            <Button data-testid="button-outline" variant="outline">Outline</Button>
            <Button data-testid="button-ghost" variant="ghost">Ghost</Button>
            <Button data-testid="button-gradient" variant="gradient">Gradient</Button>
            <Button data-testid="button-success" variant="success">Success</Button>
            <Button data-testid="button-warning" variant="warning">Warning</Button>
            <Button data-testid="button-error" variant="error">Error</Button>
          </div>
        </div>

        {/* Button Sizes */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-4">Button Sizes</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button data-testid="button-extra-small" size="xs">Extra Small</Button>
            <Button data-testid="button-small" size="sm">Small</Button>
            <Button data-testid="button-medium" size="md">Medium</Button>
            <Button data-testid="button-large" size="lg">Large</Button>
            <Button data-testid="button-extra-large" size="xl">Extra Large</Button>
          </div>
        </div>

        {/* Button States */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-4">Button States</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Normal</Button>
            <Button data-testid="button-loading" variant="primary" loading>
              Loading Button
            </Button>
            <Button data-testid="button-disabled" variant="primary" disabled>
              Disabled Button
            </Button>
          </div>
        </div>

        {/* Icon Buttons */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-4">Icon Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              data-testid="button-with-icon" 
              icon={<span data-testid="button-icon">🚀</span>} 
              iconPosition="left"
            >
              With Icon
            </Button>
            <Button 
              icon={<span>➡️</span>} 
              iconPosition="right"
            >
              Right Icon
            </Button>
            <Button 
              data-testid="button-icon-only" 
              icon={<span>⭐</span>} 
              iconOnly 
            />
          </div>
        </div>

        {/* Full Width Button */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-4">Full Width Button</h2>
          <Button data-testid="button-full-width" variant="gradient" fullWidth>
            Full Width Button
          </Button>
        </div>

        {/* Button Types */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-4">Button Types</h2>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="flex gap-4">
              <Button type="button">Button Type</Button>
              <Button type="submit" variant="success">Submit Type</Button>
              <Button type="reset" variant="warning">Reset Type</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ButtonDemoPage;
