import Link from 'next/link';
import Page from '@/components/page';
import Button from '@/components/button';

export default function Home() {
  return (
    <Page>
      <Link href="/mapbox">
        <Button>Get Started!</Button>
      </Link>
    </Page>
  );
}
