import { FC, ReactNode } from 'react';

type Props = {
  /** Heading of the current step. */
  title: string;
  /** The cart, usually CheckoutCartSummary: above the steps on mobile, in the right column from lg. */
  sidebar: ReactNode;
  /** Shown below the heading, e.g. a CheckoutErrorAlert. */
  alert?: ReactNode;
  /** Progress, usually CheckoutSteps. */
  steps: ReactNode;
  /** The current step. */
  children: ReactNode;
};

/** The checkout page: the step (3/5) beside the cart (2/5) from lg. */
export const CheckoutLayout: FC<Props> = ({ title, sidebar, alert, steps, children }) => (
  <div className="mx-auto max-w-6xl">
    <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
      <aside className="order-1 lg:order-2 lg:col-span-2">{sidebar}</aside>

      <div className="order-2 lg:order-1 lg:col-span-3">
        <h1 className="mb-6 font-bold">{title}</h1>

        {alert ? <div className="mb-6">{alert}</div> : null}

        {steps}
        {children}
      </div>
    </div>
  </div>
);

type LoadingProps = {
  /** With a title: the checkout's own loading state. Without: a single line, e.g. as Suspense fallback. */
  title?: string;
  text: string;
};

/** The checkout while the cart is read from the browser's storage. */
export const CheckoutLoading: FC<LoadingProps> = ({ title, text }) =>
  title ? (
    <div>
      <h1 className="font-bold">{title}</h1>
      <p className="mt-4 text-sm text-gray-500">{text}</p>
    </div>
  ) : (
    <p className="text-gray-600">{text}</p>
  );
