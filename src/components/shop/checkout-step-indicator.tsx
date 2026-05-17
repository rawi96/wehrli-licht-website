import { CheckoutStep } from '@/types/checkout';
import { CheckIcon } from '@heroicons/react/24/solid';

const STEPS: CheckoutStep[] = ['shipping', 'details', 'payment', 'review'];

const stepTitles: Record<CheckoutStep, string> = {
  shipping: 'Versand',
  details: 'Angaben',
  payment: 'Zahlung',
  review: 'Übersicht',
};

type Props = {
  currentStep: CheckoutStep;
};

export const CheckoutStepIndicator = ({ currentStep }: Props) => {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <header className="mb-10">
      <nav aria-label="Checkout-Fortschritt">
        <ol className="flex w-full">
          {STEPS.map((step, index) => {
            const isComplete = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <li key={step} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {index > 0 ? (
                    <span aria-hidden className={`h-0.5 flex-1 ${index <= currentIndex ? 'bg-wehrli' : 'bg-gray-200'}`} />
                  ) : (
                    <span aria-hidden className="flex-1" />
                  )}
                  <span
                    className={`mx-2 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isComplete
                        ? 'bg-wehrli text-white'
                        : isCurrent
                          ? 'border-wehrli text-wehrli border-2'
                          : 'border border-gray-300 text-gray-400'
                    }`}
                  >
                    {isComplete ? <CheckIcon className="size-4" aria-hidden /> : index + 1}
                  </span>
                  {index < STEPS.length - 1 ? (
                    <span aria-hidden className={`h-0.5 flex-1 ${index < currentIndex ? 'bg-wehrli' : 'bg-gray-200'}`} />
                  ) : (
                    <span aria-hidden className="flex-1" />
                  )}
                </div>
                <span
                  className={`mt-2 text-center text-xs sm:text-sm ${
                    isCurrent ? 'text-wehrli font-bold' : isComplete ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {stepTitles[step]}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
};
