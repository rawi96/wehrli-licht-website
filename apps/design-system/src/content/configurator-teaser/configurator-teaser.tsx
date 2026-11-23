import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';
import { Button } from '../../actions/button/button';
import { Image, ImageData } from '../image/image';

type Props = {
  eyebrow?: string;
  title: string;
  text?: string;
  /** Short promises, e.g. «In 8 einfachen Schritten». */
  features?: string[];
  /** Opens the configurator (`onClick`) or links to its page (`href`, e.g. on the home page, where nothing loads). */
  action: { label: string; onClick?: () => void; href?: string };
  /** Small print beside the button, e.g. «Dauert etwa 3 Minuten». */
  note?: string;
  /** A picture of the configurator (e.g. a screenshot of the 3D view); without it a drawn, glowing lamp. */
  image?: ImageData | null;
};

/** Invitation to start a configurator: text and a start button on the brand colour, next to a glowing lamp. */
export const ConfiguratorTeaser: FC<Props> = ({ eyebrow, title, text, features = [], action, note, image }) => (
  <section className="bg-wehrli my-8 grid overflow-hidden rounded-md text-white shadow-md md:grid-cols-[1.1fr_1fr]">
    <div className="flex flex-col justify-center gap-5 p-6 sm:p-10">
      <div className="flex flex-col gap-3">
        {eyebrow ? <p className="text-xs font-bold text-white/80">{eyebrow}</p> : null}
        <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
        {text ? <p className="text-sm text-white/80">{text}</p> : null}
      </div>
      {features.length > 0 ? (
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm marker:text-white/80">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      ) : null}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
        <Button variant="primary-white" onClick={action.onClick} href={action.href}>
          {action.label}
          <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Button>
        {note ? <p className="text-xs text-white/80">{note}</p> : null}
      </div>
    </div>
    {image ? (
      <div className="relative min-h-72 md:min-h-104">
        <Image image={image} sizes="(min-width: 1400px) 640px, (min-width: 768px) 46vw, 92vw" absolute />
      </div>
    ) : (
      <GlowingLamp />
    )}
  </section>
);

/** A lamp whose shade glows warm in the dark, with a softly pulsing cone of light. */
const GlowingLamp: FC = () => (
  <div className="bg-wehrli-dark relative min-h-64 overflow-hidden" aria-hidden="true">
    <svg viewBox="0 0 400 320" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="teaser-glow" cx="50%" cy="38%" r="50%">
          <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="teaser-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff1d6" />
          <stop offset="100%" stopColor="#f3c27a" />
        </linearGradient>
        <linearGradient id="teaser-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe2b0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffe2b0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="teaser-brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8f6f33" />
          <stop offset="50%" stopColor="#e2c27e" />
          <stop offset="100%" stopColor="#8f6f33" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="120" r="190" fill="url(#teaser-glow)" />
      <path className="animate-light-beam" d="M150 160 L250 160 L330 320 L70 320 Z" fill="url(#teaser-cone)" />
      <path d="M163 72 L237 72 L262 160 L138 160 Z" fill="url(#teaser-shade)" />
      <ellipse cx="200" cy="160" rx="62" ry="7" fill="#fff6e4" />
      <rect x="196" y="160" width="8" height="70" fill="url(#teaser-brass)" />
      <ellipse cx="200" cy="246" rx="34" ry="22" fill="url(#teaser-brass)" />
      <rect x="0" y="268" width="400" height="52" fill="#000" opacity="0.18" />
    </svg>
  </div>
);
