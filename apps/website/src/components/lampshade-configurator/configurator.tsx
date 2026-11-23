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
  Button,
  ChoiceChips,
  ColorSwatches,
  ConfiguratorShell,
  FileButton,
  IconButton,
  OptionGroup,
  RangeField,
  SegmentedControl,
  SilhouettePicker,
  StageMessage,
  StepWizard,
  WizardStep,
} from '@wehrli/design-system';
import dynamic from 'next/dynamic';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import type { CameraFocus, StageHandle } from './scene/stage';
import { StageBoundary, supportsWebGL } from './stage-boundary';

const Stage = dynamic(() => import('./scene/stage').then((module) => module.Stage), {
  ssr: false,
  loading: () => <StageMessage>3D-Ansicht wird geladen…</StageMessage>,
});

/** Index of the last step («Entwurf»). */
const LAST_STEP = 6;

const UNSUPPORTED =
  'Die 3D-Ansicht läuft in diesem Browser nicht. Sie können Ihren Lampenschirm trotzdem zusammenstellen und anfragen.';

type Props = {
  /** Page with the contact form, for the inquiry. */
  contactPath: string;
};

const SILHOUETTES = SHAPES.map((shape) => ({
  id: shape.id,
  label: shape.label,
  path: silhouettePath(toShapeParams(withShape(DEFAULT_DESIGN, shape.id))),
}));

/**
 * 3D lampshade configurator, guided step by step: room and lamp, form, size, material, colour, details, and finally
 * the light. The camera follows each step. Shows what the atelier can make; no prices. The design can be shared and
 * sent as an inquiry.
 */
export const LampshadeConfigurator: FC<Props> = ({ contactPath }) => {
  const [design, setDesign] = useState<LampshadeDesign>(DEFAULT_DESIGN);
  const [stepIndex, setStepIndex] = useState(0);
  const [lightOn, setLightOn] = useState(true);
  const [dimmer, setDimmer] = useState(0.85);
  const [kelvin, setKelvin] = useState(2700);
  const [showSizes, setShowSizes] = useState(false);
  const [motif, setMotif] = useState<HTMLImageElement | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [webGL, setWebGL] = useState<boolean | null>(null);
  const stageRef = useRef<StageHandle | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const motifUrlRef = useRef<string | null>(null);

  // Browser-only: a shared design comes in the URL hash; WebGL decides whether the 3D view can run.
  useEffect(() => {
    const shared = decodeDesign(window.location.hash);
    if (shared) {
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- the hash is only readable after mount
      setDesign(shared);
      // A shared design opens finished, ready to look at and inquire.
      setStepIndex(LAST_STEP);
    }
    setWebGL(supportsWebGL());
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
    // The last entry is the current state when several arrive at once.
    const observer = new IntersectionObserver((entries) => setVisible(entries.at(-1)?.isIntersecting ?? true));
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
  const lining = LININGS.find(({ id }) => id === design.lining) ?? LININGS[0];
  const advice = sizeAdvice(design);
  const round = shape.corners === 2 && design.depth === 100;
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

  const lightControls = (
    <OptionGroup title="Licht">
      <SegmentedControl
        label="Tageszeit"
        value={lightOn ? 'abend' : 'tag'}
        onChange={(time) => setLightOn(time === 'abend')}
        options={[
          { id: 'tag', label: 'Tag', icon: 'sun' },
          { id: 'abend', label: 'Abend, Licht an', icon: 'moon' },
        ]}
      />
      {lightOn && (
        <>
          <RangeField
            label="Helligkeit"
            unit="%"
            value={Math.round(dimmer * 100)}
            min={10}
            max={100}
            onChange={(value) => setDimmer(value / 100)}
          />
          <SegmentedControl<number>
            label="Lichtfarbe"
            size="small"
            value={kelvin}
            onChange={setKelvin}
            options={LIGHT_TEMPERATURES.map((option) => ({
              id: option.kelvin,
              label: `${option.kelvin} K`,
              title: option.label,
            }))}
          />
        </>
      )}
    </OptionGroup>
  );

  const steps: (WizardStep & { focus: CameraFocus })[] = [
    {
      id: 'raum',
      label: 'Raum',
      title: 'Wo soll Ihr Lampenschirm leuchten?',
      description: 'Wählen Sie Raum und Leuchte. Oder starten Sie mit einer unserer Ideen und passen Sie sie an.',
      focus: 'room',
      content: (
        <>
          <OptionGroup title="Raum">
            <ChoiceChips label="Raum" options={ROOMS} value={design.room} onChange={(room) => update({ room })} />
          </OptionGroup>
          <OptionGroup title="Leuchte" hint={shape.half ? 'Ein Halbschild gehört an die Wand.' : undefined}>
            <ChoiceChips label="Leuchte" options={lamps} value={design.lamp} onChange={(lamp) => update({ lamp })} />
          </OptionGroup>
          <OptionGroup title="Oder mit einer Idee starten">
            <ChoiceChips
              label="Ideen"
              options={PRESETS.map(({ label }) => ({ id: label, label }))}
              onChange={(label) => setDesign(PRESETS.find((preset) => preset.label === label)?.design ?? DEFAULT_DESIGN)}
            />
          </OptionGroup>
        </>
      ),
    },
    {
      id: 'form',
      label: 'Form',
      title: 'Welche Form gefällt Ihnen?',
      description: `Form ${shape.form} · ${plainLabel(shape.label)}. Jede unserer 21 Grundformen fertigen wir in jeder Grösse.`,
      focus: 'shade',
      content: (
        <OptionGroup title="Grundform" hideTitle>
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
      title: 'Wie gross soll er werden?',
      description: 'Wir fertigen auf den Zentimeter genau. Die Masse sehen Sie direkt in der Ansicht.',
      focus: 'shade',
      content: (
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
            label={shape.corners === 2 ? 'Tiefe (oval)' : 'Tiefe'}
            unit="%"
            value={design.depth}
            {...SIZE_LIMITS.depth}
            onChange={(depth) => update({ depth })}
          />
        </OptionGroup>
      ),
    },
    {
      id: 'material',
      label: 'Material',
      title: 'Aus welchem Material?',
      description:
        'Das Material bestimmt, wie das Licht durch den Schirm fällt. Schalten Sie oben zwischen Tag und Abend um.',
      focus: 'close',
      content: (
        <OptionGroup title="Material" hideTitle hint={material.effect}>
          <ChoiceChips
            label="Material"
            options={MATERIALS}
            value={design.material}
            onChange={(id) => setDesign((current) => withMaterial(current, id))}
          />
        </OptionGroup>
      ),
    },
    {
      id: 'farbe',
      label: 'Farbe',
      title: material.colors ? 'Welcher Ton?' : 'Farbe und Muster',
      description: material.colors
        ? `${material.label} gibt es in diesen natürlichen Tönen.`
        : 'Jede Farbe ist möglich, auch Ihr eigenes Bild als Motiv.',
      focus: 'close',
      content: (
        <>
          <OptionGroup title={material.colors ? 'Ton' : 'Farbe'}>
            <ColorSwatches
              colors={colorsOf(design.material)}
              value={design.color}
              onChange={(color) => update({ color })}
              custom={!material.colors}
            />
          </OptionGroup>
          {material.patterns && (
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
                label={design.pattern === 'motiv' ? 'Anderes Bild wählen' : 'Eigenes Bild als Motiv'}
                accept="image/*"
                active={design.pattern === 'motiv'}
                onFile={chooseMotif}
              />
            </OptionGroup>
          )}
        </>
      ),
    },
    {
      id: 'details',
      label: 'Details',
      title: 'Der letzte Schliff',
      description: 'Futter, Kante und Gestell machen den Schirm zu Ihrem.',
      focus: 'close',
      content: (
        <>
          <OptionGroup title="Futter innen" hint={lining.effect}>
            <ColorSwatches
              colors={LININGS}
              value={lining.hex}
              onChange={(hex) => update({ lining: LININGS.find((item) => item.hex === hex)?.id ?? 'weiss' })}
              custom={false}
            />
          </OptionGroup>
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
        </>
      ),
    },
    {
      id: 'entwurf',
      label: 'Entwurf',
      title: 'Ihr Lampenschirm',
      description: 'Dimmen Sie das Licht, speichern oder teilen Sie den Entwurf und fragen Sie ihn unverbindlich an.',
      focus: 'shade',
      content: (
        <>
          {lightControls}
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

  return (
    <ConfiguratorShell
      ref={rootRef}
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
              paused={!visible}
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
      hint={stageReady && !interacted ? 'Ziehen oder wischen zum Drehen, scrollen oder mit zwei Fingern zoomen' : undefined}
      notice={notice}
      options={
        <StepWizard
          label="Schritte des Konfigurators"
          steps={steps}
          current={stepIndex}
          onChange={setStepIndex}
          finish={
            <Button variant="primary" fullWidth onClick={inquire}>
              Diesen Entwurf anfragen
            </Button>
          }
          note="Unverbindlich: Wir melden uns mit Ideen, Stoffmustern und einer Offerte."
        />
      }
    />
  );
};
