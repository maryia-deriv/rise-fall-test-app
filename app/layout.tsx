import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import { inter } from '@/lib/fonts';
import { TemplateLayout } from '@/components/custom/template-layout';
import '@/app/globals.css';
import '@deriv-com/smartcharts-champion/dist/smartcharts.css';
import './custom.css';

// SmartCharts declares `font-family: IBM Plex Sans, sans-serif` internally.
// Loading the font here makes it available to those declarations so the chart
// renders with its intended typeface instead of falling back to the system
// sans-serif.  We apply the variable to <body> so the @font-face rules are
// emitted; SmartCharts resolves the family name automatically.
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Deriv Rise/Fall Trading App',
  description: 'A white-label trading application powered by Deriv',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full lg:h-auto" suppressHydrationWarning>
      <body
        className={`${inter.className} ${ibmPlexSans.variable} bg-background flex min-h-dvh flex-col overflow-hidden max-lg:h-dvh max-lg:overflow-hidden lg:block lg:h-auto lg:min-h-screen lg:overflow-x-hidden lg:overflow-y-auto`}
      >
        <TemplateLayout>{children}</TemplateLayout>
      </body>
    </html>
  );
}
