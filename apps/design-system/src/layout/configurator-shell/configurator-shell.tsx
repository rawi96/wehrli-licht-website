import { FC, ReactNode } from 'react';

type Props = {
  /** The interactive view (e.g. a 3D canvas); fills its area. */
  stage: ReactNode;
  /** Controls on top of the view: top left and top right (stacked). */
  stageTopLeft?: ReactNode;
  stageTopRight?: ReactNode;
  /** Short usage hint at the bottom of the view, e.g. until the visitor interacts. */
  hint?: ReactNode;
  /** Short confirmation (e.g. «Link kopiert»), announced to screen readers. */
  notice?: string | null;
  /** The options, usually a StepWizard; they scroll on their own. */
  options: ReactNode;
};

/**
 * Layout of a product configurator that fills its container (e.g. a FullscreenDialog): a large view with controls
 * on top, the options beside it. On phones the view sits above and the options scroll below it.
 */
export const ConfiguratorShell: FC<Props> = ({ stage, stageTopLeft, stageTopRight, hint, notice, options }) => (
  <div className="flex size-full flex-col bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_440px]">
    <div className="relative h-[40svh] min-h-56 shrink-0 bg-gray-200 lg:h-full">
      {stage}
      {stageTopLeft ? <div className="absolute top-3 left-3 flex flex-col items-start gap-2">{stageTopLeft}</div> : null}
      {stageTopRight ? <div className="absolute top-3 right-3 flex flex-col gap-2">{stageTopRight}</div> : null}
      {hint ? (
        <p className="text-xxs pointer-events-none absolute inset-x-3 bottom-3 mx-auto w-fit rounded-full bg-black/55 px-3 py-1 text-center font-bold text-white">
          {hint}
        </p>
      ) : null}
      <p aria-live="polite" className="pointer-events-none absolute inset-x-0 top-16 flex justify-center">
        {notice ? (
          <span className="animate-pop-in rounded-full bg-black/75 px-4 py-2 text-sm font-bold text-white">{notice}</span>
        ) : null}
      </p>
    </div>

    <div className="flex min-h-0 flex-1 flex-col border-gray-200 lg:h-full lg:border-l">{options}</div>
  </div>
);

/** A message in place of the view, e.g. while it loads or when the browser cannot show it. */
export const StageMessage: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex size-full items-center justify-center p-8 text-center text-sm font-bold text-gray-600">
    {children}
  </div>
);
