import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
// import ScrollToTopButton from "@/components/ScrollToTopButton";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Nitean — Sharing Daily Articles",
        template: "%s | Nitean",
    },
    description:
        "Nitean is a modern platform for sharing daily articles on technology, development, design, and digital innovation. Learn, build, and grow with Nitean.",
    keywords: [
        "Nitean",
        "Technology articles",
        "Web development",
        "Programming",
        "Design",
        "Tech blog",
        "Software engineering",
    ],
    authors: [{ name: "Nitean Team" }],
    creator: "Nitean",
    publisher: "Nitean",

    openGraph: {
        title: "Nitean — Sharing Daily Articles",
        description:
        "Explore daily articles about technology, development, design, and digital innovation on Nitean.",
        siteName: "Nitean",
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Nitean — Sharing Daily Articles",
        description:
        "Explore daily articles about technology, development, design, and digital innovation on Nitean.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ComponentProps<"html">["children"];
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                    {/* <ScrollToTopButton /> */}
                    <Analytics/>
                </ThemeProvider>
            </body>
        </html>
    );
}
