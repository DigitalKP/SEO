import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEO Pulse | Elite SEO Mastermind & Live Intelligence Feed",
  description: "Join the live SEO war room. Discuss ranking experiments, reverse-engineer Google algorithms, share AI SEO workflows, solve indexing barriers, and explore premium technical SEO career opportunities.",
  keywords: [
    "SEO Community",
    "Technical SEO",
    "AI SEO Tactics",
    "Google Core Update Recovery",
    "SEO Jobs",
    "SEO War Room",
    "Mastermind",
    "Indexing solutions"
  ],
  authors: [{ name: "SEO Pulse Team" }],
  openGraph: {
    title: "SEO Pulse | Elite SEO Mastermind & Live Intelligence Feed",
    description: "Futuristic SEO community platform. Best technical answers rise to the top automatically through live engagement ranking.",
    type: "website",
  },
  verification: {
    google: "pYYw3LoaThdqCh8OAn0eQ34XZVjVE_nIIS3OLPnrqgI",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-[#030712] text-[#f3f4f6] font-sans antialiased overflow-x-hidden">
        {/* Google Analytics Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T7GNB6HRT3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T7GNB6HRT3');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
