import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/peak/theme-provider";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://peakmedia.in"),
  title: {
    default: "Peak Media — Premium Digital Marketing Agency in India",
    template: "%s · Peak Media",
  },
  description:
    "Peak Media is a Mumbai-based premium digital marketing agency engineering growth for ambitious Indian brands — branding, SEO, paid media, social, web design & content. Festive-ready, vernacular, performance-linked.",
  keywords: [
    "digital marketing agency India",
    "digital marketing agency Mumbai",
    "performance marketing agency India",
    "branding agency Mumbai",
    "SEO agency India",
    "paid advertising agency",
    "social media marketing agency India",
    "D2C marketing agency India",
    "web design agency India",
    "content creation agency",
    "Peak Media",
  ],
  authors: [{ name: "Peak Media" }],
  creator: "Peak Media",
  openGraph: {
    title: "Peak Media — Premium Digital Marketing Agency in India",
    description:
      "Mumbai's results-obsessed growth agency for Indian D2C, fintech, edtech & more. Branding, SEO, paid media, social, web & content — built to scale.",
    url: "https://peakmedia.in",
    siteName: "Peak Media",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peak Media — Premium Digital Marketing Agency in India",
    description:
      "Mumbai's results-obsessed growth agency. Branding, SEO, paid media, social, web & content — built to scale Indian brands.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="bottom-right" theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
