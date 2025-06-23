import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GameProvider } from './GameContext';
import { GameLayout } from './GameLayout';
import { GameHeader } from './GameHeader';
import { SlotMachine } from './SlotMachine';
import { GameFooter } from './GameFooter';
import './slotMachine.css';

const meta: Meta<typeof SlotMachine> = {
  title: 'Game/SlotMachine',
  component: SlotMachine,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
  },
};
export default meta;

type Story = StoryObj<typeof SlotMachine>;

export const Default: Story = {
  render: () => (
    <GameProvider>
      <GameLayout>
        <GameHeader 
          userCoins={10000}
          onExit={() => console.log('Exit game')}
          className="mb-4"
        />
        
        <div className="flex-1 flex items-center justify-center p-4">
          <SlotMachine />
        </div>
        
        <GameFooter className="mt-6" />
      </GameLayout>
    </GameProvider>
  ),
};
