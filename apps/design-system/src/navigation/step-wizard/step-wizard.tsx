'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { FC, ReactNode, useEffect, useRef } from 'react';
import { Button } from '../../actions/button/button';
import { cn } from '../../fundamentals/cn';

export type WizardStep = {
  id: string;
  /** Short name in the progress bar, e.g. «Form». */
  label: string;
  /** Question or heading of the step, e.g. «Welche Form passt?». */
  title: string;
  description?: ReactNode;
  content: ReactNode;
};

type Props = {
  steps: WizardStep[];
  /** Index of the shown step. */
  current: number;
  onChange: (index: number) => void;
  /** Accessible name of the progress navigation. */
  label: string;
  /** In place of the «Weiter» button on the last step, e.g. an inquiry. */
  finish?: ReactNode;
  /** Small print below the buttons on the last step. */
  note?: string;
};

/**
 * Guides through a choice step by step: a progress bar (every step can be opened directly), the question of the
 * step, its options and «Zurück» / «Weiter» at the bottom (sticky on phones, so they stay within reach).
 */
export const StepWizard: FC<Props> = ({ steps, current, onChange, label, finish, note }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shownRef = useRef(current);
  const step = steps[current] ?? steps[0];
  const next = steps[current + 1];
  const previous = current > 0 ? steps[current - 1] : undefined;

  // After a step change: the new step starts at its top, focus moves to its question (screen readers announce it),
  // and the progress bar comes into view.
  useEffect(() => {
    if (shownRef.current === current) {
      return;
    }
    shownRef.current = current;
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    headingRef.current?.focus({ preventScroll: true });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = rootRef.current;
    // Only scroll up when the progress bar is hidden (e.g. under the sticky view on phones).
    if (root && root.getBoundingClientRect().top < Number.parseFloat(getComputedStyle(root).scrollMarginTop)) {
      root.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
    }
  }, [current]);

  return (
    <div ref={rootRef} className="flex min-h-0 flex-1 scroll-mt-[max(50svh,18rem)] flex-col lg:scroll-mt-5">
      <nav aria-label={label} className="border-b border-gray-200 px-5 pt-4 pb-3">
        <ol className="flex gap-1">
          {steps.map((item, index) => (
            <li key={item.id} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onChange(index)}
                aria-current={index === current ? 'step' : undefined}
                className="group flex w-full flex-col gap-1.5 py-1 text-left"
              >
                <span
                  aria-hidden
                  className={cn(
                    'h-1 w-full rounded-full transition-colors duration-300',
                    index <= current ? 'bg-wehrli' : 'bg-gray-200 group-hover:bg-gray-400',
                  )}
                />
                <span
                  className={cn(
                    'text-xxxs truncate font-bold',
                    index === current ? 'text-wehrli' : index < current ? 'text-black' : 'text-gray-600',
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto">
        <div key={step.id} className="animate-step-in flex flex-col gap-6 p-5">
          <header>
            <p className="text-xs font-bold text-gray-600">
              Schritt {current + 1} von {steps.length}
            </p>
            <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-xl font-bold text-black outline-none">
              {step.title}
            </h2>
            {step.description ? <p className="mt-2 text-sm text-gray-600">{step.description}</p> : null}
          </header>
          {step.content}
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-3 border-t border-gray-200 bg-gray-50 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          {previous ? (
            <button
              type="button"
              onClick={() => onChange(current - 1)}
              className="flex shrink-0 items-center gap-1 rounded-md px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-black"
            >
              <ChevronLeftIcon className="size-5" aria-hidden />
              Zurück
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            {next ? (
              <Button variant="primary" fullWidth onClick={() => onChange(current + 1)}>
                Weiter: {next.label}
                <ChevronRightIcon className="-mr-1 ml-1 size-5" aria-hidden />
              </Button>
            ) : (
              finish
            )}
          </div>
        </div>
        {!next && note ? <p className="text-xxs text-gray-600">{note}</p> : null}
      </div>
    </div>
  );
};
