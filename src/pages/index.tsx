import styles from '@/styles/Home.module.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Page from '@/components/page';
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <Page>
      <Link className={styles.center} href="/mapbox">
        <button
          className={inter.className}
          style={{
            backgroundColor: 'transparent',
            border: 'solid 2px rgba(172, 175, 176, 0.3)',
            borderRadius: '0.3rem',
            padding: '0.5rem 1rem',
          }}
        >
          Create Map
        </button>
      </Link>
    </Page>
  );
}
