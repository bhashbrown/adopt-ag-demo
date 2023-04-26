import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children?: ReactNode;
};

export default function Page(props: Props) {
  return (
    <>
      <Head>
        <title>Adopt-Ag Map</title>
        <meta name="description" content="A tool for creating custom maps" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <Link href="/">
            <p>Adopt-Ag</p>
          </Link>
        </div>
        {props.children}
        <div />
      </main>
    </>
  );
}
