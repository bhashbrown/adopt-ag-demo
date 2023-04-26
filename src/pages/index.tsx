import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import Page from '@/components/page';

export default function Home() {
  return (
    <Page>
      <Link className={styles.center} href="/mapbox">
        Adopt-Ag Map
      </Link>
    </Page>
  );
}
