import Link from 'next/link';
import Page from '@/components/page';
import { Box, Button, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Image from 'next/image';

export default function Home() {
  return (
    <Page>
      <Box
        display="flex"
        alignItems={{ xs: 'center', sm: 'start' }}
        flexDirection={{
          xs: 'column-reverse',
          sm: 'column-reverse',
          md: 'row',
        }}
        margin="3rem 0"
        width="100%"
      >
        <Box maxWidth="70rem">
          <Typography
            component="h1"
            sx={{ typography: { xs: 'h4', sm: 'h3', md: 'h2' } }}
          >
            Creating value from agricultural data has never been easier.
          </Typography>
          <Typography paragraph sx={{ margin: '1rem 0 2rem 0' }}>
            Draw out shapes on any plot of land in real-time and save the
            results.
          </Typography>
          <Link href="/mapbox">
            <Button
              size="large"
              variant="contained"
              endIcon={<ArrowForwardIosIcon />}
              sx={{ width: { xs: '100%', sm: 'auto', md: 'auto' } }}
            >
              Get Started!
            </Button>
          </Link>
        </Box>
        <Box
          position="relative"
          minHeight={{ xs: 262, sm: 290, md: 328 }}
          minWidth={{ xs: 312, sm: 350, md: 390 }}
          sx={{ margin: '0.5rem 0' }}
        >
          <Link href="/mapbox">
            <Image
              alt="mapbox example"
              src="/mapbox_example.png"
              fill
              priority
            />
          </Link>
        </Box>
      </Box>
    </Page>
  );
}
