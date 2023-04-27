import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import logo from 'public/adopt_logo-t.webp';
import Image from 'next/image';

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
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <main className={`${styles.main} ${inter.className}`}>
          <header style={{ width: '100%' }}>
            <Link href="/">
              <Image
                alt="adopt logo"
                src="/adopt_logo-t.webp"
                height={111}
                width={318}
              />
            </Link>
          </header>
          {props.children}
        </main>
      </div>
    </>
  );
}
