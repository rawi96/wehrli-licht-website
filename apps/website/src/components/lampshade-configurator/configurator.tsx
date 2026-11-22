'use client';

import { CONTACT_FORM_ANCHOR, DESIGN_PREFILL_PARAM } from '@/domain/contact/links';
import {
  FABRIC_COLORS,
  FINISHES,
  findMaterial,
  findShape,
  LAMPS,
  LIGHT_TEMPERATURES,
  LININGS,
  MATERIALS,
  PATTERNS,
  ROOMS,
  SHAPES,
  SIZE_LIMITS,
  TRIMS,
} from '@/domain/lampshade/catalog';
import {
  colorsOf,
  decodeDesign,
  DEFAULT_DESIGN,
  describeDesign,
  encodeDesign,
  LampshadeDesign,
  plainLabel,
  PRESETS,
  randomDesign,
  sizeAdvice,
  withMaterial,
  withShape,
} from '@/domain/lampshade/design';
import { silhouettePath, toShapeParams } from '@/domain/lampshade/shape';
import {
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
  CheckCircleIcon,
  LightBulbIcon,
  MoonIcon,
  PhotoIcon,
  ShareIcon,
  SparklesIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { Button, cn } from '@wehrli/design-system';
import dynamic from 'next/dynamic';
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ChoiceChips, OptionGroup, SizeSlider, Swatches } from './options';
import type { StageHandle } from './scene/stage';

const Stage = dynamic(() => import('./scene/stage').then((module) => module.Stage), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center text-sm font-bold text-gray-600">
      3D-Ansicht wird geladen…
    </div>
  ),
});

type TabId = 'form' | 'groesse' | 'material' | 'farbe' | 'details' | 'raum';

const TABS: { id: TabId; label: string }[] = [
  { id: 'form', label: 'Form' },
  { id: 'groesse', label: 'Grösse' },
  { id: 'material', label: 'Material' },
  { id: 'farbe', label: 'Farbe' },
  { id: 'details', label: 'Details' },
  { id: 'raum', label: 'Leuchte' },
];

type Props = {
  /** Page with the contact form, for the inquiry. */
  contactPath: string;
};

const ToolButton: FC<{ label: string; onClick: () => void; pressed?: boolean; children: ReactNode }> = ({
  label,
  onClick,
  pressed,
  children,
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={pressed}
    onClick={onClick}
    className={cn(
      'flex size-10 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-colors',
      pressed ? 'bg-wehrli text-white' : 'text-wehrli bg-white/85 hover:bg-white',
    )}
  >
    {children}
  </button>
);

/**
 * 3D lampshade configurator: form, size, material, colour, lining, trim, lamp and room, with the light switched on
 * in the evening. Shows what the atelier can make; no prices. The design can be shared and sent as an inquiry.
 */
export const LampshadeConfigurator: FC<Props> = ({ contactPath }) => {
  const [design, setDesign] = useState<LampshadeDesign>(DEFAULT_DESIGN);
  const [tab, setTab] = useState<TabId>('form');
  const [lightOn, setLightOn] = useState(true);
  const [dimmer, setDimmer] = useState(0.85);
  const [kelvin, setKelvin] = useState(2700);
  const [showSizes, setShowSizes] = useState(false);
  const [motif, setMotif] = useState<HTMLImageElement | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [visible, setVisible] = useState(true);
  const stageRef = useRef<StageHandle | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const motifUrlRef = useRef<string | null>(null);

  // A shared design comes in the URL hash.
  useEffect(() => {
    const shared = decodeDesign(window.location.hash);
    if (shared) {
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- the hash is only readable after mount
      setDesign(shared);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.history.replaceState(null, '', `#${encodeDesign(design)}`);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [design]);

  // Render only while visible: saves battery when scrolled away or in a background tab.
  useEffect(() => {
    const element = rootRef.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timeout = window.setTimeout(() => setNotice(null), 2600);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(
    () => () => {
      if (motifUrlRef.current) {
        URL.revokeObjectURL(motifUrlRef.current);
      }
    },
    [],
  );

  const update = (changes: Partial<LampshadeDesign>) => setDesign((current) => ({ ...current, ...changes }));
  const shape = findShape(design.shape);
  const material = findMaterial(design.material);
  const advice = sizeAdvice(design);
  const round = shape.corners === 2;
  const silhouettes = useMemo(
    () =>
      Object.fromEntries(SHAPES.map((item) => [item.id, silhouettePath(toShapeParams(withShape(DEFAULT_DESIGN, item.id)))])),
    [],
  );

  const inquiryHref = () => {
    const summary = [
      'Ich interessiere mich für einen Lampenschirm nach Mass:',
      ...describeDesign(design).map((line) => `– ${line}`),
      '',
      `Entwurf: ${window.location.origin}${window.location.pathname}#${encodeDesign(design)}`,
    ].join('\n');

    return `${contactPath}?${DESIGN_PREFILL_PARAM}=${encodeURIComponent(summary)}#${CONTACT_FORM_ANCHOR}`;
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${encodeDesign(design)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mein Lampenschirm', url });

        return;
      }
      await navigator.clipboard.writeText(url);
      setNotice('Link kopiert');
    } catch {
      // Sharing cancelled.
    }
  };

  const saveImage = () => {
    const data = stageRef.current?.capture();
    if (!data) {
      return;
    }
    const link = document.createElement('a');
    link.href = data;
    link.download = `lampenschirm-${plainLabel(shape.label).toLowerCase().replaceAll(' ', '-')}.jpg`;
    link.click();
    setNotice('Bild gespeichert');
  };

  const chooseMotif = (file: File | undefined) => {
    if (!file) {
      return;
    }
    if (motifUrlRef.current) {
      URL.revokeObjectURL(motifUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    motifUrlRef.current = url;
    const image = new Image();
    image.onload = () => {
      setMotif(image);
      update({ pattern: 'motiv' });
    };
    image.onerror = () => setNotice('Dieses Bild kann nicht geladen werden');
    image.src = url;
  };

  const tabContent: Record<TabId, ReactNode> = {
    form: (
      <OptionGroup
        title="Grundform"
        hint={`Form ${shape.form} aus unseren 21 Grundformen. Jede Form fertigen wir in jeder Grösse.`}
      >
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {SHAPES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === design.shape}
              onClick={() => setDesign((current) => withShape(current, item.id))}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md border p-2 text-center transition-colors',
                item.id === design.shape ? 'border-wehrli bg-wehrli-50' : 'hover:border-wehrli border-gray-200 bg-white',
              )}
            >
              <svg viewBox="0 0 100 100" className="size-12" aria-hidden="true">
                <path d={silhouettes[item.id]} className={item.id === design.shape ? 'fill-wehrli' : 'fill-gray-400'} />
              </svg>
              <span className="text-xs leading-tight font-bold text-black">{item.label}</span>
            </button>
          ))}
        </div>
      </OptionGroup>
    ),
    groesse: (
      <OptionGroup
        title="Masse"
        hint={
          <span className="flex items-start gap-2">
            {advice.fits ? (
              <CheckCircleIcon className="text-success size-5 shrink-0" aria-hidden="true" />
            ) : (
              <LightBulbIcon className="text-wehrli size-5 shrink-0" aria-hidden="true" />
            )}
            {advice.text}
          </span>
        }
      >
        <SizeSlider label="Höhe" value={design.height} {...SIZE_LIMITS.height} onChange={(height) => update({ height })} />
        <SizeSlider
          label={round && design.depth === 100 ? 'Durchmesser unten' : 'Breite unten'}
          value={design.bottom}
          {...SIZE_LIMITS.bottom}
          onChange={(bottom) => update({ bottom })}
        />
        <SizeSlider
          label={round && design.depth === 100 ? 'Durchmesser oben' : 'Breite oben'}
          value={design.top}
          {...SIZE_LIMITS.top}
          onChange={(top) => update({ top })}
        />
        <SizeSlider
          label={round ? 'Tiefe (oval)' : 'Tiefe'}
          unit="%"
          value={design.depth}
          {...SIZE_LIMITS.depth}
          onChange={(depth) => update({ depth })}
        />
        <button
          type="button"
          onClick={() => setShowSizes((current) => !current)}
          className="text-wehrli self-start text-sm font-bold underline-offset-4 hover:underline"
        >
          {showSizes ? 'Masse in der Ansicht ausblenden' : 'Masse in der Ansicht zeigen'}
        </button>
      </OptionGroup>
    ),
    material: (
      <OptionGroup title="Material" hint={material.effect}>
        <ChoiceChips
          options={MATERIALS}
          value={design.material}
          onChange={(id) => setDesign((current) => withMaterial(current, id))}
        />
      </OptionGroup>
    ),
    farbe: (
      <div className="flex flex-col gap-6">
        <OptionGroup title={material.colors ? 'Ton' : 'Farbe'}>
          <Swatches
            colors={colorsOf(design.material)}
            value={design.color}
            onChange={(color) => update({ color })}
            custom={!material.colors}
          />
        </OptionGroup>
        {material.patterns ? (
          <OptionGroup
            title="Muster"
            hint={
              design.pattern === 'motiv'
                ? 'Ihr Bild bleibt auf Ihrem Gerät. Wir bedrucken Stoffe und Pergament mit Fotos und Motiven.'
                : undefined
            }
          >
            <ChoiceChips
              options={PATTERNS.filter(({ id }) => id !== 'motiv')}
              value={design.pattern}
              onChange={(pattern) => update({ pattern })}
            />
            {design.pattern !== 'uni' && design.pattern !== 'motiv' && (
              <Swatches
                colors={FABRIC_COLORS}
                value={design.patternColor}
                onChange={(patternColor) => update({ patternColor })}
              />
            )}
            <label
              className={cn(
                'flex cursor-pointer items-center gap-2 self-start rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors',
                design.pattern === 'motiv'
                  ? 'border-wehrli bg-wehrli text-white'
                  : 'hover:border-wehrli border-gray-200 bg-white',
              )}
            >
              <PhotoIcon className="size-4" aria-hidden="true" />
              {design.pattern === 'motiv' ? 'Anderes Bild wählen' : 'Eigenes Bild als Motiv'}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => chooseMotif(event.target.files?.[0])}
              />
            </label>
          </OptionGroup>
        ) : (
          <p className="text-sm text-gray-600">{material.label} gibt es ohne Muster.</p>
        )}
      </div>
    ),
    details: (
      <div className="flex flex-col gap-6">
        <OptionGroup title="Futter innen" hint={LININGS.find(({ id }) => id === design.lining)?.effect}>
          <Swatches
            colors={LININGS}
            value={LININGS.find(({ id }) => id === design.lining)?.hex ?? ''}
            onChange={(hex) => update({ lining: LININGS.find((lining) => lining.hex === hex)?.id ?? 'weiss' })}
            custom={false}
          />
        </OptionGroup>
        <OptionGroup title="Kante oben und unten">
          <ChoiceChips options={TRIMS} value={design.trim} onChange={(trim) => update({ trim })} />
          {design.trim !== 'keine' && (
            <Swatches colors={FABRIC_COLORS} value={design.trimColor} onChange={(trimColor) => update({ trimColor })} />
          )}
        </OptionGroup>
      </div>
    ),
    raum: (
      <div className="flex flex-col gap-6">
        <OptionGroup title="Leuchte" hint={shape.half ? 'Ein Halbschild gehört an die Wand.' : undefined}>
          <ChoiceChips
            options={shape.half ? LAMPS.filter(({ id }) => id === 'wand') : LAMPS}
            value={design.lamp}
            onChange={(lamp) => update({ lamp })}
          />
        </OptionGroup>
        <OptionGroup title="Gestell">
          <ChoiceChips options={FINISHES} value={design.finish} onChange={(finish) => update({ finish })} />
        </OptionGroup>
        <OptionGroup title="Raum">
          <ChoiceChips options={ROOMS} value={design.room} onChange={(room) => update({ room })} />
        </OptionGroup>
      </div>
    ),
  };

  return (
    <div
      ref={rootRef}
      className="my-8 overflow-clip rounded-md bg-white shadow-md lg:grid lg:grid-cols-[minmax(0,1fr)_420px]"
    >
      {/* 3D view: stays in sight on phones while the options below are scrolled */}
      <div className="sticky top-0 z-10 h-[50svh] min-h-72 bg-gray-200 lg:relative lg:h-[min(80svh,760px)]">
        <Stage
          design={design}
          lightOn={lightOn}
          dimmer={dimmer}
          kelvin={kelvin}
          motif={motif}
          showSizes={showSizes}
          paused={!visible}
          handle={stageRef}
          onInteract={() => setInteracted(true)}
        />

        {/* Day or evening, dimmer and light colour */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="flex rounded-full bg-white/85 p-1 shadow-md backdrop-blur-sm" role="group" aria-label="Tageszeit">
            {[
              { on: false, label: 'Tag', icon: <SunIcon className="size-4" aria-hidden="true" /> },
              { on: true, label: 'Abend', icon: <MoonIcon className="size-4" aria-hidden="true" /> },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                aria-pressed={lightOn === option.on}
                onClick={() => setLightOn(option.on)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors',
                  lightOn === option.on ? 'bg-wehrli text-white' : 'text-wehrli hover:bg-white',
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
          {lightOn && (
            <div className="flex w-52 flex-col gap-2 rounded-md bg-white/85 p-3 shadow-md backdrop-blur-sm sm:w-60">
              <label className="flex items-center gap-2 text-xs font-bold text-black">
                <LightBulbIcon className="text-wehrli size-4 shrink-0" aria-hidden="true" />
                <span className="sr-only">Helligkeit</span>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={Math.round(dimmer * 100)}
                  onChange={(event) => setDimmer(Number(event.target.value) / 100)}
                  className="accent-wehrli w-full cursor-pointer"
                />
              </label>
              <div className="flex gap-1" role="group" aria-label="Lichtfarbe">
                {LIGHT_TEMPERATURES.map((option) => (
                  <button
                    key={option.kelvin}
                    type="button"
                    title={`${option.label}, ${option.kelvin} K`}
                    aria-pressed={kelvin === option.kelvin}
                    onClick={() => setKelvin(option.kelvin)}
                    className={cn(
                      'text-xxs flex-1 rounded-full px-0.5 py-1 font-bold whitespace-nowrap tabular-nums transition-colors',
                      kelvin === option.kelvin ? 'bg-wehrli text-white' : 'text-black hover:bg-white',
                    )}
                  >
                    {option.kelvin} K
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tools */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <ToolButton label="Überraschen Sie mich" onClick={() => setDesign((current) => randomDesign(current))}>
            <SparklesIcon className="size-5" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Masse anzeigen" pressed={showSizes} onClick={() => setShowSizes((current) => !current)}>
            <ArrowsPointingOutIcon className="size-5" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Bild speichern" onClick={saveImage}>
            <ArrowDownTrayIcon className="size-5" aria-hidden="true" />
          </ToolButton>
          <ToolButton label="Entwurf teilen" onClick={() => void share()}>
            <ShareIcon className="size-5" aria-hidden="true" />
          </ToolButton>
        </div>

        {/* Rooms */}
        <div
          className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] gap-1 overflow-x-auto rounded-full bg-white/85 p-1 shadow-md backdrop-blur-sm"
          role="group"
          aria-label="Raum"
        >
          {ROOMS.map((room) => (
            <button
              key={room.id}
              type="button"
              aria-pressed={design.room === room.id}
              onClick={() => update({ room: room.id })}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-sm font-bold transition-colors',
                design.room === room.id ? 'bg-wehrli text-white' : 'text-wehrli hover:bg-white',
              )}
            >
              {room.label}
            </button>
          ))}
        </div>

        {!interacted && (
          <p className="pointer-events-none absolute right-3 bottom-16 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white lg:bottom-4">
            <span className="pointer-coarse:hidden">Ziehen zum Drehen, scrollen zum Zoomen</span>
            <span className="hidden pointer-coarse:inline">Wischen zum Drehen, mit zwei Fingern zoomen</span>
          </p>
        )}
        <p aria-live="polite" className="pointer-events-none absolute inset-x-0 top-16 flex justify-center">
          {notice && <span className="rounded-full bg-black/75 px-4 py-2 text-sm font-bold text-white">{notice}</span>}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col border-gray-200 lg:max-h-[min(80svh,760px)] lg:border-l">
        <div className="border-b border-gray-200 px-5 pt-5 pb-4">
          <p className="mb-2 text-xs font-bold text-gray-600 uppercase">Inspiration</p>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setDesign(preset.design)}
                className="hover:border-wehrli shrink-0 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-bold text-black transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex overflow-x-auto border-b border-gray-200 px-2.5" role="tablist" aria-label="Gestalten">
          {TABS.map((item) => (
            <button
              key={item.id}
              id={`tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              aria-controls="configurator-panel"
              onClick={() => setTab(item.id)}
              className={cn(
                '-mb-px shrink-0 border-b-2 px-2 py-3 text-sm font-bold transition-colors',
                tab === item.id ? 'border-wehrli text-wehrli' : 'border-transparent text-gray-600 hover:text-black',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div id="configurator-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="flex-1 overflow-y-auto p-5">
          {tabContent[tab]}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 p-5">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-black">
              Form {shape.form} · {shape.label}
            </span>
            , {material.label}, {design.height} × {design.bottom} cm
          </p>
          <Button variant="primary" fullWidth onClick={() => window.location.assign(inquiryHref())}>
            Diesen Entwurf anfragen
          </Button>
          <p className="text-xs text-gray-600">Unverbindlich: Wir melden uns mit Ideen, Stoffmustern und einer Offerte.</p>
        </div>
      </div>
    </div>
  );
};
