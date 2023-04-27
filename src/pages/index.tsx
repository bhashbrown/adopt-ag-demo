import Link from 'next/link';
import Page from '@/components/page';
import { Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Home() {
  return (
    <Page>
      <Link href="/mapbox">
        <Button
          size="large"
          variant="contained"
          endIcon={<ArrowForwardIosIcon />}
        >
          Get Started!
        </Button>
      </Link>
    </Page>
  );
}
