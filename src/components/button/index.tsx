import styles from '@/styles/Home.module.css';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'onClick'>;

export default function Button(props: Props) {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      style={{
        backgroundColor: 'transparent',
        border: 'solid 2px rgba(172, 175, 176, 0.3)',
        borderRadius: '0.3rem',
        padding: '0.5rem 1rem',
      }}
    >
      {props.children}
    </button>
  );
}
