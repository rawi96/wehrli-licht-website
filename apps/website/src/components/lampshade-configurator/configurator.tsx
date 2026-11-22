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
  OverlayCard,
  RangeField,
  SegmentedControl,
  SilhouettePicker,
  StageMessage,
  Tabs,
} from '@wehrli/design-system';
import dynamic from 'next/dynamic';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import type { StageHandle } from './scene/stage';
import { StageBoundary, supportsWebGL } from './stage-boundary';

const Stage = dynamic(() => import('./scene/stage').then((module) => module.Stage), {
  ssr: false,
  loading: () => <StageMessage>3D-Ansicht wird geladen…</StageMessage>,
});

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
 * 3D lampshade configurator: form, size, material, colour, lining, trim, lamp and room, with the light switched on
 * in the evening. Shows what the atelier can make; no prices. The design can be shared and sent as an inquiry.
 */
export const LampshadeConfigurator: FC<Props> = ({ contactPath }) => {
  const [design, setDesign] = useState<LampshadeDesign>(DEFAULT_DESIGN);
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

  const tabs = [
    {
      id: 'form',
      label: 'Form',
      content: (
        <OptionGroup
          title="Grundform"
          hint={`Form ${shape.form} aus unseren 21 Grundformen. Jede Form fertigen wir in jeder Grösse.`}
        >
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
      content: (
        <OptionGroup title="Masse" hint={advice.text} hintTone={advice.fits ? 'ok' : 'tip'}>
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
          <ChoiceChips
            options={[{ id: 'masse', label: showSizes ? 'Masse ausblenden' : 'Masse in der Ansicht zeigen' }]}
            onChange={() => setShowSizes((current) => !current)}
          />
        </OptionGroup>
      ),
    },
    {
      id: 'material',
      label: 'Material',
      content: (
        <OptionGroup title="Material" hint={material.effect}>
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
      content: (
        <div className="flex flex-col gap-6">
          <OptionGroup title={material.colors ? 'Ton' : 'Farbe'}>
            <ColorSwatches
              colors={colorsOf(design.material)}
              value={design.color}
              onChange={(color) => update({ color })}
              custom={!material.colors}
            />
          </OptionGroup>
          <OptionGroup
            title="Muster"
            hint={
              !material.patterns
                ? `${material.label} gibt es ohne Muster.`
                : design.pattern === 'motiv'
                  ? 'Ihr Bild bleibt auf Ihrem Gerät. Wir bedrucken Stoffe und Pergament mit Fotos und Motiven.'
                  : undefined
            }
          >
            {material.patterns && (
              <>
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
              </>
            )}
          </OptionGroup>
        </div>
      ),
    },
    {
      id: 'details',
      label: 'Details',
      content: (
        <div className="flex flex-col gap-6">
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
        </div>
      ),
    },
    {
      id: 'leuchte',
      label: 'Leuchte',
      content: (
        <div className="flex flex-col gap-6">
          <OptionGroup title="Leuchte" hint={shape.half ? 'Ein Halbschild gehört an die Wand.' : undefined}>
            <ChoiceChips label="Leuchte" options={lamps} value={design.lamp} onChange={(lamp) => update({ lamp })} />
          </OptionGroup>
          <OptionGroup title="Gestell">
            <ChoiceChips
              label="Gestell"
              options={FINISHES}
              value={design.finish}
              onChange={(finish) => update({ finish })}
            />
          </OptionGroup>
          <OptionGroup title="Raum">
            <ChoiceChips label="Raum" options={ROOMS} value={design.room} onChange={(room) => update({ room })} />
          </OptionGroup>
        </div>
      ),
    },
  ];

  const unsupported = <StageMessage>{UNSUPPORTED}</StageMessage>;
  const stageReady = webGL === true;

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
              showSizes={showSizes}
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
          <>
            <SegmentedControl
              label="Tageszeit"
              value={lightOn ? 'abend' : 'tag'}
              onChange={(time) => setLightOn(time === 'abend')}
              options={[
                { id: 'tag', label: 'Tag', icon: 'sun' },
                { id: 'abend', label: 'Abend', icon: 'moon' },
              ]}
            />
            {lightOn && (
              <OverlayCard>
                <RangeField
                  label="Helligkeit"
                  hideLabel
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
              </OverlayCard>
            )}
          </>
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
            <IconButton
              icon="measure"
              label="Masse anzeigen"
              pressed={showSizes}
              onClick={() => setShowSizes((current) => !current)}
            />
            <IconButton icon="download" label="Bild speichern" onClick={saveImage} />
            <IconButton icon="share" label="Entwurf teilen" onClick={() => void share()} />
          </>
        )
      }
      stageBottomLeft={
        stageReady && (
          <SegmentedControl label="Raum" value={design.room} onChange={(room) => update({ room })} options={ROOMS} />
        )
      }
      hint={stageReady && !interacted ? 'Ziehen oder wischen zum Drehen, scrollen oder mit zwei Fingern zoomen' : undefined}
      notice={notice}
      presets={
        <ChoiceChips
          label="Inspiration"
          scroll
          options={PRESETS.map(({ label }) => ({ id: label, label }))}
          onChange={(label) => setDesign(PRESETS.find((preset) => preset.label === label)?.design ?? DEFAULT_DESIGN)}
        />
      }
      options={<Tabs label="Gestalten" items={tabs} />}
      summary={
        <>
          <strong className="text-black">
            Form {shape.form} · {shape.label}
          </strong>
          , {material.label}, {design.height} × {design.bottom} cm
        </>
      }
      action={
        <Button variant="primary" fullWidth onClick={inquire}>
          Diesen Entwurf anfragen
        </Button>
      }
      note="Unverbindlich: Wir melden uns mit Ideen, Stoffmustern und einer Offerte."
    />
  );
};
