import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { WalkthroughProvider } from "@/components/walkthrough/WalkthroughProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NDAProtection from "@/components/NDAProtection";

export const metadata: Metadata = {
  title: "بذرة - بيئة الوساطة الذكية الأولى في السعودية",
  description: "بذرة هي بيئة وساطة ذكية مدعومة بالذكاء الاصطناعي، تربط أصحاب المشاريع بالمستثمرين والداعمين لتحويل الأفكار إلى واقع",
  keywords: "بذرة, وساطة ذكية, تمويل المشاريع, استثمار, مشاريع ناشئة, ذكاء اصطناعي, السعودية",
  authors: [{ name: "CandlesTech - A.S" }],
  creator: "CandlesTech - A.S",
  publisher: "بذرة",
  metadataBase: new URL('https://bithrahapp.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "بذرة - بيئة الوساطة الذكية الأولى",
    description: "بذرة هي بيئة وساطة ذكية مدعومة بالذكاء الاصطناعي، تربط أصحاب المشاريع بالمستثمرين والداعمين",
    url: 'https://bithrahapp.com',
    siteName: 'بذرة',
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "بذرة - بيئة الوساطة الذكية الأولى",
    description: "بذرة هي بيئة وساطة ذكية مدعومة بالذكاء الاصطناعي",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#14B8A6" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <ToastProvider>
            <WalkthroughProvider>
              <NDAProtection>
                {children}
                <Footer />
              </NDAProtection>
            </WalkthroughProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

