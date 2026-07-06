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
  metadataBase: new URL("https://peakmedia.agency"),
  title: {
    default: "Peak Media — Premium Digital Marketing Agency",
    template: "%s · Peak Media",
  },
  description:
    "Peak Media is a results-obsessed digital marketing agency engineering brand growth through SEO, paid media, social, web design and content. Strategy → Creative → Launch → Scale.",
  keywords: [
    "digital marketing agency",
    "branding agency",
    "SEO agency",
    "paid advertising",
    "social media marketing",
    "web design",
    "content creation",
    "Peak Media",
  ],
  authors: [{ name: "Peak Media" }],
  creator: "Peak Media",
  openGraph: {
    title: "Peak Media — Premium Digital Marketing Agency",
    description:
      "We engineer brand growth. Branding, SEO, paid media, social, web design & content — built to scale.",
    url: "https://peakmedia.agency",
    siteName: "Peak Media",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peak Media — Premium Digital Marketing Agency",
    description:
      "We engineer brand growth. Branding, SEO, paid media, social, web design & content.",
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
