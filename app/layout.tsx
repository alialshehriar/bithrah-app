import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "بذرة - بيئة وساطة ذكية | النسخة التجريبية",
  description: "بذرة هي بيئة وساطة ذكية مدعومة بالذكاء الاصطناعي، تهدف لحل مشكلة صعوبة الوصول للتمويل. النسخة تحت التطوير.",
  keywords: "بذرة، وساطة ذكية، تمويل، استثمار، مشاريع، السعودية",
  openGraph: {
    title: "بذرة - بيئة وساطة ذكية",
    description: "بيئة وساطة ذكية مدعومة بالذكاء الاصطناعي",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

