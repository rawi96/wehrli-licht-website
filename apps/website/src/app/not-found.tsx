import NotFound from '@/components/not-found';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seite nicht gefunden — Wehrli Licht GmbH',
};

const NotFoundPage = () => {
  return <NotFound />;
};

export default NotFoundPage;
