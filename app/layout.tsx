// app/layout.tsx
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google'; // Import Cairo font
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Footer } from './components/Footer';

// Configure the font
const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '900'] 
});

export const metadata: Metadata = {
  title: 'WajehniTN - دليلك للتوجيه الجامعي',
  description: 'أدخل معدلاتك في البكالوريا واكتشف أفضل شعب التوجيه الجامعي لك في تونس',
  // --- NEW: Add SEO Keywords and Metadata ---
  keywords: [
    'Tawjih', 'Orientation TN', 'Bac Tunisie', 'Score Bac', 'Wajehni',
    'توجيه جامعي', 'بكالوريا تونس', 'حساب سكور الباك', 'دليل التوجيه', 'وجهني'
  ],
  authors: [{ name: 'Zied kmanter' }], 
  creator: 'Zied kmanter',
  publisher: 'Zied kmanter',
  openGraph: {
    title: 'WajehniTN | دليلك للتوجيه الجامعي',
    description: 'أدخل معدلاتك واكتشف مستقبلك الأكاديمي بثقة وسهولة.',
    url: 'https://wajehnitn-app.vercel.app', // IMPORTANT: Replace with your live domain
    siteName: 'WajehniTN',
    images: [
      {
        url: 'https://wajehnitn-app.vercel.app/og-image.png', // We will create this image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ar_TN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WajehniTN | دليلك للتوجيه الجامعي',
    description: 'أدخل معدلاتك في البكالوريا واكتشف أفضل شعب التوجيه الجامعي لك في تونس.',
    images: ['https://wajehnitn-app.vercel.app/og-image.png'], // We will create this image
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* --- PASTE THE GOOGLE VERIFICATION TAG HERE --- */}
        <meta name="google-site-verification" content="YOUR_UNIQUE_CODE_HERE" />
      </head>
      <body className={cairo.className}> {/* Apply font to the entire app */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="absolute top-4 right-4 z-10">
            <ThemeSwitcher />
          </div>
          {children}
          <Footer />
        </ThemeProvider>

        {/* --- 2. Add the AdSense Script --- */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />

      </body>
    </html>
  );
}