import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconButton } from '../../actions/icon-button/icon-button';
import { SegmentedControl } from '../../forms/segmented-control/segmented-control';
import { StepWizard } from '../../navigation/step-wizard/step-wizard';
import { ConfiguratorShell, StageMessage } from './configurator-shell';

const meta: Meta<typeof ConfiguratorShell> = {
  title: 'Layout/ConfiguratorShell',
  component: ConfiguratorShell,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-[44rem]">
        <Story />
      </div>
    ),
  ],
  args: {
    stage: <StageMessage>3D-Ansicht</StageMessage>,
    stageTopLeft: (
      <SegmentedControl
        label="Tageszeit"
        value="abend"
        onChange={() => undefined}
        options={[
          { id: 'tag', label: 'Tag', icon: 'sun' },
          { id: 'abend', label: 'Abend', icon: 'moon' },
        ]}
      />
    ),
    stageTopRight: <IconButton icon="share" label="Teilen" onClick={() => undefined} />,
    hint: 'Ziehen zum Drehen',
    options: (
      <StepWizard
        label="Schritte"
        current={0}
        onChange={() => undefined}
        steps={[
          { id: 'form', label: 'Form', title: 'Welche Form?', content: <p className="text-sm">Formen</p> },
          { id: 'farbe', label: 'Farbe', title: 'Welche Farbe?', content: <p className="text-sm">Farben</p> },
        ]}
      />
    ),
  },
};

export default meta;
type Story = StoryObj<typeof ConfiguratorShell>;

export const Default: Story = {};

export const WithNotice: Story = { args: { notice: 'Link kopiert' } };

export const Unsupported: Story = {
  args: { stage: <StageMessage>Die 3D-Ansicht läuft in diesem Browser nicht.</StageMessage>, stageTopLeft: null },
};
