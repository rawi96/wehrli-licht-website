import { CheckIcon } from '@heroicons/react/24/solid';
import { FC } from 'react';
import { cn } from '../../fundamentals/cn';

type Props = {
  steps: { id: string; title: string }[];
  /** id of the current step; steps before it show a check mark. */
  currentStep: string;
  /** Accessible name of the navigation. */
  label?: string;
};

/** Progress of the checkout: numbered circles joined by lines, with the step titles below. */
export const CheckoutSteps: FC<Props> = ({ steps, currentStep, label = 'Checkout-Fortschritt' }) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <header className="mb-10">
      <nav aria-label={label}>
        <ol className="flex w-full">
          {steps.map((step, index) => {
            const isComplete = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <li key={step.id} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {index > 0 ? (
                    <span aria-hidden className={cn('h-0.5 flex-1', index <= currentIndex ? 'bg-wehrli' : 'bg-gray-200')} />
                  ) : (
                    <span aria-hidden className="flex-1" />
                  )}
                  <span
                    className={cn(
                      'mx-2 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                      isComplete
                        ? 'bg-wehrli text-white'
                        : isCurrent
                          ? 'border-wehrli text-wehrli border-2'
                          : 'border border-gray-300 text-gray-400',
                    )}
                  >
                    {isComplete ? <CheckIcon className="size-4" aria-hidden /> : index + 1}
                  </span>
                  {index < steps.length - 1 ? (
                    <span aria-hidden className={cn('h-0.5 flex-1', index < currentIndex ? 'bg-wehrli' : 'bg-gray-200')} />
                  ) : (
                    <span aria-hidden className="flex-1" />
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-center text-xs sm:text-sm',
                    isCurrent ? 'text-wehrli font-bold' : isComplete ? 'text-gray-900' : 'text-gray-400',
                  )}
                >
                  {step.title}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
};
