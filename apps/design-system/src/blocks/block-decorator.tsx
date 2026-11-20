import type { Decorator } from '@storybook/nextjs-vite';
import { Container } from '../layout/container/container';

/** Story decorator: blocks render inside the page Container, as on the website. */
export const inContainer: Decorator = (Story) => (
  <Container>
    <Story />
  </Container>
);

/** For full-width (100vw) blocks: clips the horizontal overflow that 100vw causes next to a scrollbar. */
export const inContainerFullWidth: Decorator = (Story) => (
  <div className="overflow-x-clip">
    <Container>
      <Story />
    </Container>
  </div>
);
