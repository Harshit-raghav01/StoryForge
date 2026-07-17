import type { Metadata } from "next";
import { Fraunces, Public_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: { default: "StoryForge — Stories worth staying up for", template: "%s | StoryForge" },
  description:
    "StoryForge is a web-first digital fiction platform where authors serialize novels chapter-by-chapter and readers unlock stories using a coin economy. Romance, fantasy, dark fiction, and more.",
  keywords: ["fiction", "romance", "fantasy", "werewolf", "serial fiction", "online novels", "reading"],
  openGraph: {
    title: "StoryForge — Stories worth staying up for",
    description: "Read and publish serialized fiction on StoryForge.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${fraunces.variable} ${publicSans.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text-primary font-body">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
