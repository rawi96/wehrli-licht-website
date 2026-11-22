import { FC, ReactNode, Ref } from 'react';

type Props = {
  /** The interactive view (e.g. a 3D canvas); fills its area. */
  stage: ReactNode;
  /** Controls on top of the view: top left, top right (stacked), bottom left. */
  stageTopLeft?: ReactNode;
  stageTopRight?: ReactNode;
  stageBottomLeft?: ReactNode;
  /** Short usage hint at the bottom right of the view, e.g. until the visitor interacts. */
  hint?: ReactNode;
  /** Short confirmation (e.g. «Link kopiert»), announced to screen readers. */
  notice?: string | null;
  /** Above the options, e.g. preset chips. */
  presets?: ReactNode;
  presetsTitle?: string;
  /** The options, usually Tabs. */
  options: ReactNode;
  /** Summary of the current choice, above the action. */
  summary?: ReactNode;
  /** The main action, e.g. an inquiry button. */
  action?: ReactNode;
  note?: string;
  /** For observing the visibility of the whole configurator. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Layout of a product configurator: a large view with controls on top, the options beside it (below on phones,
 * where the view stays in sight while the options scroll).
 */
export const ConfiguratorShell: FC<Props> = ({
  stage,
  stageTopLeft,
  stageTopRight,
  stageBottomLeft,
  hint,
  notice,
  presets,
  presetsTitle = 'Inspiration',
  options,
  summary,
  action,
  note,
  ref,
}) => (
  <div ref={ref} className="my-8 overflow-clip rounded-md bg-white shadow-md lg:grid lg:grid-cols-[minmax(0,1fr)_420px]">
    <div className="sticky top-0 z-10 h-[50svh] min-h-72 bg-gray-200 lg:relative lg:h-[min(80svh,760px)]">
      {stage}
      {stageTopLeft ? <div className="absolute top-3 left-3 flex flex-col items-start gap-2">{stageTopLeft}</div> : null}
      {stageTopRight ? <div className="absolute top-3 right-3 flex flex-col gap-2">{stageTopRight}</div> : null}
      {stageBottomLeft ? <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)]">{stageBottomLeft}</div> : null}
      {hint ? (
        <p className="text-xxs pointer-events-none absolute right-3 bottom-16 rounded-full bg-black/55 px-3 py-1 font-bold text-white">
          {hint}
        </p>
      ) : null}
      <p aria-live="polite" className="pointer-events-none absolute inset-x-0 top-16 flex justify-center">
        {notice ? <span className="rounded-full bg-black/75 px-4 py-2 text-sm font-bold text-white">{notice}</span> : null}
      </p>
    </div>

    <div className="flex flex-col border-gray-200 lg:max-h-[min(80svh,760px)] lg:border-l">
      {presets ? (
        <div className="border-b border-gray-200 px-5 pt-5 pb-4">
          <p className="mb-2 text-xs font-bold text-gray-600">{presetsTitle}</p>
          {presets}
        </div>
      ) : null}
      {options}
      {summary || action || note ? (
        <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 p-5">
          {summary ? <p className="text-sm text-gray-600">{summary}</p> : null}
          {action}
          {note ? <p className="text-xxs text-gray-600">{note}</p> : null}
        </div>
      ) : null}
    </div>
  </div>
);

/** A message in place of the view, e.g. while it loads or when the browser cannot show it. */
export const StageMessage: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex size-full items-center justify-center p-8 text-center text-sm font-bold text-gray-600">
    {children}
  </div>
);

/** A small translucent card on top of the view, e.g. for a dimmer. */
export const OverlayCard: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex w-52 flex-col gap-2 rounded-md bg-white/85 p-3 shadow-md backdrop-blur-sm sm:w-60">{children}</div>
);
