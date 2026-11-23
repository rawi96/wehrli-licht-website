'use client';

import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from '@heroicons/react/20/solid';
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
  /** A short, friendly confirmation of the choice, e.g. «Schöne Wahl: Pagode». */
  cheer?: string;
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
 * Guides through a choice step by step, made for people who rarely use such tools: numbered steps that tick off
 * (each can be opened directly), one question per step, a friendly confirmation of the choice, and «Zurück» /
 * «Weiter» at the bottom. Fills its container; only the step content scrolls.
 */
export const StepWizard: FC<Props> = ({ steps, current, onChange, label, finish, note }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shownRef = useRef(current);
  const step = steps[current] ?? steps[0];
  const next = steps[current + 1];
  const previous = current > 0 ? steps[current - 1] : undefined;

  // After a step change the new step starts at its top and focus moves to its question (screen readers announce it).
  useEffect(() => {
    if (shownRef.current === current) {
      return;
    }
    shownRef.current = current;
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [current]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav aria-label={label} className="border-b border-gray-200 px-5 pt-4 pb-3">
        <ol className="flex items-center">
          {steps.map((item, index) => {
            const done = index < current;
            const active = index === current;

            return (
              <li key={item.id} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  onClick={() => onChange(index)}
                  aria-current={active ? 'step' : undefined}
                  aria-label={`Schritt ${index + 1}: ${item.label}`}
                  title={item.label}
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                    done && 'bg-wehrli hover:bg-wehrli-dark text-white',
                    active && 'border-wehrli text-wehrli bg-wehrli-50 border-2',
                    !done && !active && 'hover:border-wehrli border-2 border-gray-200 text-gray-600',
                  )}
                >
                  {done ? <CheckIcon key="done" className="animate-pop-in size-4" aria-hidden /> : index + 1}
                </button>
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden
                    className={cn('mx-0.5 h-0.5 flex-1 transition-colors', done ? 'bg-wehrli' : 'bg-gray-200')}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>

      <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto">
        <div key={step.id} className="animate-step-in flex flex-col gap-6 p-5">
          <header>
            <p className="text-xs font-bold text-gray-600">
              Schritt {current + 1} von {steps.length} · {step.label}
            </p>
            <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-lg font-bold text-black outline-none">
              {step.title}
            </h2>
            {step.description ? <p className="mt-2 text-sm text-gray-600">{step.description}</p> : null}
          </header>
          {step.content}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
        {step.cheer ? (
          <p
            key={step.cheer}
            aria-live="polite"
            className="animate-pop-in text-wehrli flex items-center gap-2 text-sm font-bold"
          >
            <SparklesIcon className="size-5 shrink-0" aria-hidden />
            {step.cheer}
          </p>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          {previous ? (
            <button
              type="button"
              onClick={() => onChange(current - 1)}
              className="flex shrink-0 items-center gap-0.5 rounded-md py-2.5 pr-3 text-sm font-bold text-gray-600 hover:text-black"
            >
              <ChevronLeftIcon className="size-5" aria-hidden />
              Zurück
            </button>
          ) : (
            <span />
          )}
          {next ? (
            <Button variant="primary" onClick={() => onChange(current + 1)}>
              Weiter
              <ChevronRightIcon className="-mr-1.5 ml-1 size-5" aria-hidden />
            </Button>
          ) : (
            finish
          )}
        </div>
        {!next && note ? <p className="text-xxs text-right text-gray-600">{note}</p> : null}
      </div>
    </div>
  );
};
