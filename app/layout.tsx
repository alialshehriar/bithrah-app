import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "بذرة - منصة التمويل الجماعي الرائدة في السعودية",
  description: "منصة بذرة هي منصة وساطة ذكية مدعومة بالذكاء الاصطناعي، تهدف لحل مشكلة صعوبة الوصول للتمويل",
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
        <Footer />
      </body>
    </html>
  );
}

