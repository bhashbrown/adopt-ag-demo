import { Alert, AlertProps, Snackbar, SnackbarProps } from '@mui/material';
import { ReactNode } from 'react';

type Props = { children: ReactNode } & Pick<SnackbarProps, 'open' | 'onClose'> &
  Pick<AlertProps, 'severity' | 'onClose'>;

export default function SnackbarAlert(props: Props) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={5000}
      open={props.open}
      onClose={props.onClose}
    >
      <Alert
        onClose={props.onClose}
        severity={props.severity}
        sx={{ width: '100%' }}
      >
        {props.children}
      </Alert>
    </Snackbar>
  );
}
