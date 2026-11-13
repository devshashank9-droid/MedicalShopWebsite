import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/FooterTemp";
import MobileBottomBar from "@/components/MobileBottomBar";
import InteractiveMedicineBg from "@/components/InteractiveMedicineBg";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Kajal Medical Hall | 32 Years of Trust (Est. 1994) • Patepur",
  description:
    "32-year-old medical shop established in 1994 by Sanjeet Kumar Gupta in Sahwajpur Puraina, Patepur, Vaishali, Bihar. Trusted by thousands of families for all-age human and veterinary medicines.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative flex min-h-screen flex-col bg-white text-slate-900 antialiased transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
        <LanguageProvider>
          {/* Global Translucent Interactive Medicine Background */}
          <InteractiveMedicineBg />

          <Navbar />
          <div className="relative z-10 flex-1">{children}</div>
          <div className="relative z-10">
            <Footer />
          </div>
          <MobileBottomBar />
        </LanguageProvider>
      </body>
    </html>
  );
}