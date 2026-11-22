import Link from 'next/link';
import { FC } from 'react';

export type ProjectFact = {
  label: string;
  value: string;
};

type Props = {
  facts: ProjectFact[];
  /** Services of the project, each linking to its page. */
  services?: { label: string; href: string }[];
  labels?: { services?: string };
};

/** Facts of a reference project (client, place, year …) and its services as links, in a card. */
export const ProjectFacts: FC<Props> = ({ facts, services = [], labels }) => {
  if (facts.length === 0 && services.length === 0) {
    return null;
  }

  return (
    <div className="bg-wehrli-50 my-8 grid gap-6 rounded-md p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
      {facts.map((fact) => (
        <div key={fact.label}>
          <p className="text-wehrli text-xs font-bold">{fact.label}</p>
          <p className="mt-1 text-sm font-bold text-black">{fact.value}</p>
        </div>
      ))}
      {services.length > 0 && (
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-wehrli text-xs font-bold">{labels?.services ?? 'Leistungen'}</p>
          <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {services.map((service) => (
              <li key={service.href}>
                <Link href={service.href} className="text-wehrli text-sm font-bold hover:underline">
                  {service.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
