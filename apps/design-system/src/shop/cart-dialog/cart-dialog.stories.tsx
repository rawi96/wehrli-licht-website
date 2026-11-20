import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Button } from '../../actions/button/button';
import { CartContent } from '../cart-content/cart-content';
import { MOCK_CART_LINES } from '../shop.mocks';
import { CartDialog } from './cart-dialog';

const meta: Meta = {
  title: 'Shop/CartDialog',
  component: CartDialog,
};

export default meta;

const Example = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Warenkorb öffnen
      </Button>
      <CartDialog open={open} onClose={() => setOpen(false)}>
        <CartContent
          items={MOCK_CART_LINES}
          subtotal="CHF 1’370.00"
          total="CHF 1’370.00"
          onQuantityChange={() => undefined}
          maxQuantity={10}
          onRemove={() => undefined}
          onGoToCheckout={() => setOpen(false)}
          shopHref="#"
        />
      </CartDialog>
    </>
  );
};

export const Default: StoryObj = { render: () => <Example /> };
