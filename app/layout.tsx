import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Nunito } from "next/font/google"
import "./globals.css";
import Navbar from "./components/navbar/Navbar"
import RentModal from "./components/modals/RentModal";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";
import SearchModal from "./components/modals/SearchModal";
import ReviewModal from "./components/modals/ReviewModal";

import ToasterProvider from "./providers/ToasterProvider";
import ThemeProvider from "./providers/ThemeProvider";
import getCurrentUser from "./actions/getCurrentUser";



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
    default: "Havena",
    template: "%s · Havena",
  },
  description: "Havena — find and book unique places to stay, or list your own home.",
};

const font = Nunito ({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // next-themes adds the theme class to <html> on the client before hydration
      suppressHydrationWarning
    >
      <body className={font.className}>
        <ThemeProvider>
        <ToasterProvider />
        {/* SearchModal reads useSearchParams(); static pages need a Suspense boundary around it */}
        <Suspense fallback={null}>
          <SearchModal />
        </Suspense>
        <RentModal />
        <ReviewModal />
        <LoginModal />
        <RegisterModal />
        <Navbar currentUser={currentUser}/>
        <div className="pb-20 pt-28">
          {children}
        </div>
        </ThemeProvider>
        </body>
    </html>
  );
}
