import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Button } from '../../actions/button/button';
import { StepWizard, WizardStep } from './step-wizard';

const STEPS: WizardStep[] = [
  { id: 'eins', label: 'Start', title: 'Womit möchten Sie beginnen?', content: <p className="text-sm">Optionen</p> },
  {
    id: 'zwei',
    label: 'Auswahl',
    title: 'Was gefällt Ihnen?',
    description: 'Eine kurze Erklärung zum Schritt.',
    content: <p className="text-sm">Optionen</p>,
    cheer: 'Schöne Wahl!',
  },
  { id: 'drei', label: 'Details', title: 'Der letzte Schliff', content: <p className="text-sm">Optionen</p> },
  { id: 'vier', label: 'Fertig', title: 'Ihre Auswahl', content: <p className="text-sm">Zusammenfassung</p> },
];

const Demo = ({ start }: { start: number }) => {
  const [current, setCurrent] = useState(start);

  return (
    <div className="flex h-[32rem] w-[26rem] max-w-full flex-col bg-white shadow-md">
      <StepWizard
        label="Fortschritt"
        steps={STEPS}
        current={current}
        onChange={setCurrent}
        finish={
          <Button variant="primary" fullWidth>
            Anfragen
          </Button>
        }
        note="Unverbindlich."
      />
    </div>
  );
};

const meta: Meta<typeof Demo> = {
  title: 'Navigation/StepWizard',
  component: Demo,
  args: { start: 0 },
};

export default meta;
type Story = StoryObj<typeof Demo>;

export const FirstStep: Story = {};

export const MiddleStep: Story = { args: { start: 1 } };

export const LastStep: Story = { args: { start: 3 } };
