import Link from 'next/link';
import Page from '@/components/page';
import { Button, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Home() {
  return (
    <Page>
      <div style={{ margin: '2rem 0', width: '100%' }}>
        <Typography
          component="h1"
          variant="h2"
          fontWeight={600}
          sx={{ maxWidth: '700px' }}
        >
          Creating value from agricultural data has never been easier.
        </Typography>
        <Typography
          paragraph
          sx={{ margin: '1rem 0 2rem 0', maxWidth: '700px' }}
        >
          Draw out shapes on any plot of land in real-time and save the results.
        </Typography>
        <Link href="/mapbox">
          <Button
            size="large"
            variant="contained"
            endIcon={<ArrowForwardIosIcon />}
          >
            Get Started!
          </Button>
        </Link>
      </div>
    </Page>
  );
}
