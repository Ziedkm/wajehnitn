// app/layout.tsx
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google'; // Import Cairo font
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import { ThemeSwitcher } from './components/ThemeSwitcher';

// Configure the font
const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '900'] 
});

export const metadata: Metadata = {
  title: 'WajehniTN - دليلك للتوجيه الجامعي',
  description: 'أدخل معدلاتك في البكالوريا واكتشف أفضل شعب التوجيه الجامعي لك في تونس',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairo.className}> {/* Apply font to the entire app */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="absolute top-4 right-4 z-10">
            <ThemeSwitcher />
          </div>
          {children}
        </ThemeProvider>

        {/* --- 2. Add the AdSense Script --- */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

      </body>
    </html>
  );
}