import { Button, Heading } from '@wehrli/design-system';

const NotFound = () => {
  return (
    <div className="mx-auto my-24 grid min-h-[50vh] w-11/12 items-center justify-center text-center md:my-36">
      <div>
        <Heading level="1">Seite nicht gefunden</Heading>
        <p className="peer my-2 md:max-w-prose lg:my-4">
          Die von Ihnen aufgerufene Seite konnte leider nicht gefunden werden.
        </p>
        <div className="inline-flex flex-wrap gap-2 py-4 sm:w-auto sm:gap-4 md:flex-1 [&>a]:w-full [&>a]:sm:w-auto">
          <Button variant="primary" href="/">
            Zur Startseite
          </Button>
          <Button variant="secondary" href="/kontakt">
            Kontakt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
