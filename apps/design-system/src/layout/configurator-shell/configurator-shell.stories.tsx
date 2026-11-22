import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../../actions/button/button';
import { IconButton } from '../../actions/icon-button/icon-button';
import { ChoiceChips } from '../../forms/choice-chips/choice-chips';
import { SegmentedControl } from '../../forms/segmented-control/segmented-control';
import { Tabs } from '../../navigation/tabs/tabs';
import { ConfiguratorShell, OverlayCard, StageMessage } from './configurator-shell';

const meta: Meta<typeof ConfiguratorShell> = {
  title: 'Layout/ConfiguratorShell',
  component: ConfiguratorShell,
  parameters: { layout: 'padded' },
  args: {
    stage: <StageMessage>3D-Ansicht</StageMessage>,
    stageTopLeft: (
      <>
        <SegmentedControl
          label="Tageszeit"
          value="abend"
          onChange={() => undefined}
          options={[
            { id: 'tag', label: 'Tag', icon: 'sun' },
            { id: 'abend', label: 'Abend', icon: 'moon' },
          ]}
        />
        <OverlayCard>
          <p className="text-xxs">Dimmer</p>
        </OverlayCard>
      </>
    ),
    stageTopRight: <IconButton icon="share" label="Teilen" onClick={() => undefined} />,
    stageBottomLeft: (
      <SegmentedControl
        label="Raum"
        value="wohnen"
        onChange={() => undefined}
        options={[
          { id: 'wohnen', label: 'Wohnzimmer' },
          { id: 'essen', label: 'Esszimmer' },
        ]}
      />
    ),
    hint: 'Ziehen zum Drehen',
    presets: (
      <ChoiceChips
        options={[
          { id: 'a', label: 'Klassisch' },
          { id: 'b', label: 'Modern' },
        ]}
        onChange={() => undefined}
        scroll
      />
    ),
    options: (
      <Tabs
        label="Gestalten"
        items={[
          { id: 'form', label: 'Form', content: <p className="text-sm">Formen</p> },
          { id: 'farbe', label: 'Farbe', content: <p className="text-sm">Farben</p> },
        ]}
      />
    ),
    summary: (
      <>
        <strong className="text-black">Form 03 · Konisch</strong>, Leinen
      </>
    ),
    action: (
      <Button variant="primary" fullWidth>
        Entwurf anfragen
      </Button>
    ),
    note: 'Unverbindlich.',
  },
};

export default meta;
type Story = StoryObj<typeof ConfiguratorShell>;

export const Default: Story = {};

export const WithNotice: Story = { args: { notice: 'Link kopiert' } };

export const Unsupported: Story = {
  args: { stage: <StageMessage>Die 3D-Ansicht läuft in diesem Browser nicht.</StageMessage>, stageTopLeft: null },
};
