'use client';

import { CONTACT_FORM_ANCHOR, DESIGN_PREFILL_PARAM } from '@/domain/contact/links';
import { CONFIGURATOR_START_ANCHOR } from '@/domain/lampshade/links';
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
import type { LampId, RoomId } from '@/domain/lampshade/catalog';
import {
  colorName,
  colorsOf,
  decodeDesign,
  DEFAULT_DESIGN,
  describeDesign,
  encodeDesign,
  LampshadeDesign,
  plainLabel,
  PRESETS,
  randomDesign,
  SIZE_CHOICES,
  sizeAdvice,
  sizeChoiceOf,
  sizeWidth,
  withMaterial,
  withShape,
  withSize,
} from '@/domain/lampshade/design';
import { silhouettePath, toShapeParams } from '@/domain/lampshade/shape';
import {
  Button,
  ChoiceCards,
  ChoiceChips,
  ColorSwatches,
  ConfiguratorShell,
  ConfiguratorTeaser,
  FileButton,
  FullscreenDialog,
  IconButton,
  MoreOptions,
  OptionGroup,
  RangeField,
  SegmentedControl,
  SilhouettePicker,
  StageMessage,
  StepWizard,
  WizardStep,
} from '@wehrli/design-system';
import type { ImageData } from '@wehrli/design-system';
import dynamic from 'next/dynamic';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ColorDot, LampPictogram, LightPictogram, RoomPictogram, SizeOutline } from './pictograms';
import type { CameraFocus, StageHandle } from './scene/stage';
import { StageBoundary, supportsWebGL } from './stage-boundary';

const Stage = dynamic(() => import('./scene/stage').then((module) => module.Stage), {
  ssr: false,
  loading: () => <StageMessage>3D-Ansicht wird geladen…</StageMessage>,
});

/** Index of the last step («Licht an»). */
const LAST_STEP = 7;

/** Friendly words for the choice of each step, so choosing feels like a small game. */
const PRAISE = ['Schöne Wahl', 'Sehr gut', 'Wunderbar', 'Passt', 'Herrlich', 'Prächtig', 'Fein'];

const ROOM_HINTS: Record<RoomId, string> = {
  atelier: 'Schlicht, ohne Möbel',
  wohnen: 'Beim Sofa',
  essen: 'Am Esstisch',
  schlafen: 'Am Bett',
};

const LAMP_HINTS: Record<LampId, string> = {
  tisch: 'Auf Kommode oder Nachttisch',
  steh: 'Neben Sofa oder Sessel',
  pendel: 'Hängt von der Decke',
  wand: 'An der Wand',
};

const firstSentence = (text: string) => text.split('. ')[0].replace(/\.?$/, '.');

const labelOf = <T extends string>(id: T, options: { id: T; label: string }[]) =>
  options.find((option) => option.id === id)?.label ?? id;

const UNSUPPORTED =
  'Die 3D-Ansicht läuft in diesem Browser nicht. Sie können Ihren Lampenschirm trotzdem zusammenstellen und anfragen.';

/** Texts of the invitation that opens the configurator, from the CMS. */
export type ConfiguratorTeaserTexts = {
  eyebrow?: string;
  title: string;
  text?: string;
  points: string[];
  startLabel: string;
  note?: string;
  image?: ImageData | null;
};

type Props = {
  /** Page with the contact form, for the inquiry. */
  contactPath: string;
  teaser: ConfiguratorTeaserTexts;
};

const SILHOUETTES = SHAPES.map((shape) => ({
  id: shape.id,
  label: shape.label,
  path: silhouettePath(toShapeParams(withShape(DEFAULT_DESIGN, shape.id))),
}));

/**
 * 3D lampshade configurator as a small game, simple enough for people who rarely use such tools. The page shows a
 * teaser; «Jetzt starten» opens the configurator full screen: one question per step with picture cards (room, lamp,
 * form, size, material, colour, lining), extras folded away, praise for each choice, and at the end the light comes
 * on. The camera follows each step. No prices. The design can be shared and sent as an inquiry; closing keeps it.
 */
export const LampshadeConfigurator: FC<Props> = ({ contactPath, teaser }) => {
  const [design, setDesign] = useState<LampshadeDesign>(DEFAULT_DESIGN);
  const [stepIndex, setStepIndex] = useState(0);
  // The light comes on at the end, as the reveal of the finished shade.
  const [lightOn, setLightOn] = useState(false);
  const [dimmer, setDimmer] = useState(0.85);
  const [kelvin, setKelvin] = useState(2700);
  const [showSizes, setShowSizes] = useState(false);
  const [motif, setMotif] = useState<HTMLImageElement | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [webGL, setWebGL] = useState<boolean | null>(null);
  const stageRef = useRef<StageHandle | null>(null);
  const motifUrlRef = useRef<string | null>(null);

  // Browser-only: a shared design comes in the URL hash and opens the configurator right away. WebGL is only checked
  // when the configurator opens, so the page itself creates no GPU context.
  useEffect(() => {
    // A link from elsewhere (e.g. the home page) can open the configurator right away.
    if (window.location.hash === `#${CONFIGURATOR_START_ANCHOR}`) {
      window.history.replaceState(null, '', window.location.pathname);
      /* eslint-disable @eslint-react/set-state-in-effect */
      setStarted(true);
      setOpen(true);
      setWebGL(supportsWebGL());
      /* eslint-enable @eslint-react/set-state-in-effect */

      return;
    }
    const shared = decodeDesign(window.location.hash);
    if (shared) {
      // The hash is only readable after mount. A shared design opens finished, ready to look at and inquire.
      /* eslint-disable @eslint-react/set-state-in-effect */
      setDesign(shared);
      setStepIndex(LAST_STEP);
      setStarted(true);
      setOpen(true);
      setWebGL(supportsWebGL());
      /* eslint-enable @eslint-react/set-state-in-effect */
    }
  }, []);

  // The design goes into the URL once the visitor has started, so a reload or a shared link brings it back.
  useEffect(() => {
    if (!started) {
      return;
    }
    const timeout = window.setTimeout(() => {
      window.history.replaceState(null, '', `#${encodeDesign(design)}`);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [design, started]);

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
  const lining = LININGS.find(({ id }) => id === design.lining) ?? LININGS[0];
  const advice = sizeAdvice(design);
  const round = shape.corners === 2 && design.depth === 100;
  const lightOnRef = useRef(lightOn);
  lightOnRef.current = lightOn;

  // Last step: switch the light on, the moment the shade glows for the first time.
  useEffect(() => {
    if (stepIndex !== LAST_STEP || lightOnRef.current) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setLightOn(true);
      setNotice('Licht an!');
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [stepIndex]);

  const lamps = useMemo(() => (shape.half ? LAMPS.filter(({ id }) => id === 'wand') : LAMPS), [shape.half]);

  const stageReady = webGL === true;

  const shareUrl = () => `${window.location.origin}${window.location.pathname}#${encodeDesign(design)}`;

  const inquire = () => {
    const summary = [
      'Ich interessiere mich für einen Lampenschirm nach Mass:',
      ...describeDesign(design).map((line) => `– ${line}`),
      '',
      `Entwurf: ${shareUrl()}`,
    ].join('\n');

    window.location.assign(`${contactPath}?${DESIGN_PREFILL_PARAM}=${encodeURIComponent(summary)}#${CONTACT_FORM_ANCHOR}`);
  };

  const share = async () => {
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: 'Mein Lampenschirm', url: shareUrl() });

        return;
      }
      await navigator.clipboard.writeText(shareUrl());
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

  const chooseMotif = (file: File) => {
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

  const praise = (index: number, choice: string) => `${PRAISE[index % PRAISE.length]}: ${choice}`;
  const colorLabel = colorName(design.color, design.material);
  const sizeChoice = sizeChoiceOf(design);
  const width = Math.max(design.bottom, design.top);
  const outline = SILHOUETTES.find(({ id }) => id === design.shape)?.path ?? '';

  const steps: (WizardStep & { focus: CameraFocus })[] = [
    {
      id: 'raum',
      label: 'Raum',
      title: 'In welchem Raum soll Ihr Lampenschirm leuchten?',
      description: 'Tippen Sie einfach an, was Ihnen gefällt. Sie können jederzeit zurück und alles ändern.',
      focus: 'room',
      cheer: praise(0, ROOMS.find(({ id }) => id === design.room)?.label ?? ''),
      content: (
        <>
          <ChoiceCards
            label="Raum"
            layout="tile"
            value={design.room}
            onChange={(room) => update({ room })}
            options={ROOMS.map((room) => ({
              ...room,
              description: ROOM_HINTS[room.id],
              visual: <RoomPictogram room={room.id} />,
            }))}
          />
          <MoreOptions label="Lieber mit einer fertigen Idee starten?">
            <ChoiceChips
              label="Ideen"
              options={PRESETS.map(({ label }) => ({ id: label, label }))}
              onChange={(label) => {
                setDesign(PRESETS.find((preset) => preset.label === label)?.design ?? DEFAULT_DESIGN);
                setNotice(`Idee «${label}» übernommen`);
              }}
            />
          </MoreOptions>
        </>
      ),
    },
    {
      id: 'leuchte',
      label: 'Leuchte',
      title: 'Für welche Leuchte ist der Schirm?',
      description: shape.half ? 'Ein Halbschild gehört an die Wand.' : 'Die Leuchte erscheint sofort im Raum.',
      focus: 'room',
      cheer: praise(1, LAMPS.find(({ id }) => id === design.lamp)?.label ?? ''),
      content: (
        <ChoiceCards
          label="Leuchte"
          layout="tile"
          value={design.lamp}
          onChange={(lamp) => update({ lamp })}
          options={lamps.map((lamp) => ({
            ...lamp,
            description: LAMP_HINTS[lamp.id],
            visual: <LampPictogram lamp={lamp.id} />,
          }))}
        />
      ),
    },
    {
      id: 'form',
      label: 'Form',
      title: 'Welche Form gefällt Ihnen?',
      description: 'Tippen Sie auf eine Form. Oben sehen Sie gleich, wie sie aussieht.',
      focus: 'shade',
      cheer: praise(2, plainLabel(shape.label)),
      content: (
        <OptionGroup title="Form" hideTitle>
          <SilhouettePicker
            options={SILHOUETTES}
            value={design.shape}
            onChange={(id) => setDesign((current) => withShape(current, id))}
          />
        </OptionGroup>
      ),
    },
    {
      id: 'groesse',
      label: 'Grösse',
      title: 'Wie gross soll er sein?',
      description: 'Wählen Sie einfach klein, mittel oder gross. Wir fertigen aber auch auf den Zentimeter genau.',
      focus: 'shade',
      cheer: praise(3, `${sizeChoice ? labelOf(sizeChoice, SIZE_CHOICES) : 'Nach Mass'}, ${width} cm breit`),
      content: (
        <>
          <ChoiceCards
            label="Grösse"
            value={sizeChoice}
            onChange={(size) => setDesign((current) => withSize(current, size))}
            options={SIZE_CHOICES.map((size, index) => ({
              ...size,
              description: `Rund ${sizeWidth(design.lamp, size.id)} cm breit`,
              visual: <SizeOutline path={outline} scale={0.6 + index * 0.2} />,
            }))}
          />
          <MoreOptions label="Genau einstellen (in cm)">
            <OptionGroup title="Masse" hideTitle hint={advice.text} hintTone={advice.fits ? 'ok' : 'tip'}>
              <RangeField
                label="Höhe"
                unit="cm"
                value={design.height}
                {...SIZE_LIMITS.height}
                onChange={(height) => update({ height })}
              />
              <RangeField
                label={round ? 'Durchmesser unten' : 'Breite unten'}
                unit="cm"
                value={design.bottom}
                {...SIZE_LIMITS.bottom}
                onChange={(bottom) => update({ bottom })}
              />
              <RangeField
                label={round ? 'Durchmesser oben' : 'Breite oben'}
                unit="cm"
                value={design.top}
                {...SIZE_LIMITS.top}
                onChange={(top) => update({ top })}
              />
              <RangeField
                label={shape.corners === 2 ? 'Tiefe (für ovale Schirme)' : 'Tiefe'}
                unit="%"
                value={design.depth}
                {...SIZE_LIMITS.depth}
                onChange={(depth) => update({ depth })}
              />
            </OptionGroup>
          </MoreOptions>
        </>
      ),
    },
    {
      id: 'material',
      label: 'Material',
      title: 'Aus welchem Material?',
      description: 'Das Material bestimmt, wie schön das Licht durchscheint.',
      focus: 'close',
      cheer: praise(4, material.label),
      content: (
        <ChoiceCards
          label="Material"
          value={design.material}
          onChange={(id) => setDesign((current) => withMaterial(current, id))}
          options={MATERIALS.map((item) => ({
            id: item.id,
            label: item.label,
            description: firstSentence(item.effect),
            visual: <ColorDot hex={item.colors?.[0]?.hex ?? design.color} />,
          }))}
        />
      ),
    },
    {
      id: 'farbe',
      label: 'Farbe',
      title: material.colors ? 'Welcher Farbton?' : 'Welche Farbe?',
      description: material.colors
        ? `${material.label} gibt es in diesen natürlichen Tönen.`
        : 'Tippen Sie auf eine Farbe. Mit dem bunten Kreis am Schluss wählen Sie jede beliebige Farbe.',
      focus: 'close',
      cheer: praise(5, colorLabel.startsWith('#') ? 'Ihre eigene Farbe' : colorLabel),
      content: (
        <>
          <OptionGroup title="Farbe" hideTitle>
            <ColorSwatches
              colors={colorsOf(design.material)}
              value={design.color}
              onChange={(color) => update({ color })}
              custom={!material.colors}
            />
          </OptionGroup>
          {material.patterns && (
            <MoreOptions label="Muster oder eigenes Foto">
              <OptionGroup
                title="Muster"
                hint={
                  design.pattern === 'motiv'
                    ? 'Ihr Bild bleibt auf Ihrem Gerät. Wir bedrucken Stoffe und Pergament mit Fotos und Motiven.'
                    : undefined
                }
              >
                <ChoiceChips
                  label="Muster"
                  options={PATTERNS.filter(({ id }) => id !== 'motiv')}
                  value={design.pattern}
                  onChange={(pattern) => update({ pattern })}
                />
                {design.pattern !== 'uni' && design.pattern !== 'motiv' && (
                  <ColorSwatches
                    colors={FABRIC_COLORS}
                    value={design.patternColor}
                    onChange={(patternColor) => update({ patternColor })}
                  />
                )}
                <FileButton
                  label={design.pattern === 'motiv' ? 'Anderes Foto wählen' : 'Eigenes Foto aufdrucken'}
                  accept="image/*"
                  active={design.pattern === 'motiv'}
                  onFile={chooseMotif}
                />
              </OptionGroup>
            </MoreOptions>
          )}
        </>
      ),
    },
    {
      id: 'futter',
      label: 'Futter',
      title: 'Und innen?',
      description: 'Das Futter innen färbt das Licht, das nach unten fällt.',
      focus: 'close',
      cheer: praise(6, `Futter ${lining.label}`),
      content: (
        <>
          <ChoiceCards
            label="Futter innen"
            value={design.lining}
            onChange={(id) => update({ lining: id })}
            options={LININGS.map((item) => ({
              id: item.id,
              label: item.label,
              description: item.effect,
              visual: <ColorDot hex={item.hex} />,
            }))}
          />
          <MoreOptions label="Kante und Gestell">
            <OptionGroup title="Kante oben und unten">
              <ChoiceChips label="Kante" options={TRIMS} value={design.trim} onChange={(trim) => update({ trim })} />
              {design.trim !== 'keine' && (
                <ColorSwatches
                  colors={FABRIC_COLORS}
                  value={design.trimColor}
                  onChange={(trimColor) => update({ trimColor })}
                />
              )}
            </OptionGroup>
            <OptionGroup title="Gestell">
              <ChoiceChips
                label="Gestell"
                options={FINISHES}
                value={design.finish}
                onChange={(finish) => update({ finish })}
              />
            </OptionGroup>
          </MoreOptions>
        </>
      ),
    },
    {
      id: 'licht',
      label: 'Licht an',
      title: lightOn ? 'Ihr Lampenschirm leuchtet!' : 'Fertig! Jetzt das Licht an?',
      description: 'Bravo, Ihr Entwurf ist fertig. Gefällt er Ihnen? Dann schicken Sie ihn uns, ganz unverbindlich.',
      focus: 'shade',
      content: (
        <>
          <ChoiceCards
            label="Licht"
            layout="tile"
            value={lightOn ? 'an' : 'aus'}
            onChange={(state) => setLightOn(state === 'an')}
            options={[
              { id: 'an', label: 'Licht an', visual: <LightPictogram on /> },
              { id: 'aus', label: 'Licht aus', visual: <LightPictogram on={false} /> },
            ]}
          />
          {lightOn && (
            <MoreOptions label="Helligkeit und Lichtfarbe">
              <RangeField
                label="Helligkeit"
                unit="%"
                value={Math.round(dimmer * 100)}
                min={10}
                max={100}
                onChange={(value) => setDimmer(value / 100)}
              />
              <OptionGroup title="Lichtfarbe">
                <ChoiceChips
                  label="Lichtfarbe"
                  value={String(kelvin)}
                  onChange={(value) => setKelvin(Number(value))}
                  options={LIGHT_TEMPERATURES.map((option) => ({ id: String(option.kelvin), label: option.label }))}
                />
              </OptionGroup>
            </MoreOptions>
          )}
          <OptionGroup title="Ihr Entwurf">
            <ul className="flex flex-col gap-1 text-sm text-gray-600">
              {describeDesign(design).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {stageReady && (
              <div className="flex flex-wrap gap-x-5">
                <Button variant="secondary" onClick={saveImage}>
                  Bild speichern
                </Button>
                <Button variant="secondary" onClick={() => void share()}>
                  Entwurf teilen
                </Button>
              </div>
            )}
          </OptionGroup>
        </>
      ),
    },
  ];
  const step = steps[stepIndex] ?? steps[0];

  const unsupported = <StageMessage>{UNSUPPORTED}</StageMessage>;

  const start = () => {
    setStarted(true);
    setOpen(true);
    setWebGL((current) => current ?? supportsWebGL());
  };

  return (
    <>
      <ConfiguratorTeaser
        eyebrow={teaser.eyebrow}
        title={teaser.title}
        text={teaser.text}
        features={teaser.points}
        action={{ label: started ? 'Weiter gestalten' : teaser.startLabel, onClick: start }}
        note={teaser.note}
        image={teaser.image}
      />
      <FullscreenDialog open={open} onClose={() => setOpen(false)} title="Lampenschirm-Konfigurator">
        <ConfiguratorShell
          stage={
            webGL === false ? (
              unsupported
            ) : stageReady ? (
              <StageBoundary fallback={unsupported}>
                <Stage
                  design={design}
                  lightOn={lightOn}
                  dimmer={dimmer}
                  kelvin={kelvin}
                  motif={motif}
                  showSizes={showSizes || step.id === 'groesse'}
                  focus={step.focus}
                  handle={stageRef}
                  onInteract={() => setInteracted(true)}
                />
              </StageBoundary>
            ) : (
              <StageMessage>3D-Ansicht wird geladen…</StageMessage>
            )
          }
          stageTopLeft={
            stageReady && (
              <SegmentedControl
                label="Tageszeit"
                value={lightOn ? 'abend' : 'tag'}
                onChange={(time) => setLightOn(time === 'abend')}
                options={[
                  { id: 'tag', label: 'Tag', icon: 'sun' },
                  { id: 'abend', label: 'Abend', icon: 'moon' },
                ]}
              />
            )
          }
          stageTopRight={
            stageReady && (
              <>
                <IconButton
                  icon="sparkles"
                  label="Überraschen Sie mich"
                  onClick={() => setDesign((current) => randomDesign(current))}
                />
                {step.id !== 'groesse' && (
                  <IconButton
                    icon="measure"
                    label="Masse anzeigen"
                    pressed={showSizes}
                    onClick={() => setShowSizes((current) => !current)}
                  />
                )}
              </>
            )
          }
          hint={
            stageReady && !interacted ? 'Mit Finger oder Maus ziehen, um den Schirm von allen Seiten zu sehen' : undefined
          }
          notice={notice}
          options={
            <StepWizard
              label="Schritte des Konfigurators"
              steps={steps}
              current={stepIndex}
              onChange={setStepIndex}
              finish={
                <Button variant="primary" onClick={inquire}>
                  Entwurf senden
                </Button>
              }
              note="Unverbindlich. Wir melden uns persönlich bei Ihnen."
            />
          }
        />
      </FullscreenDialog>
    </>
  );
};
