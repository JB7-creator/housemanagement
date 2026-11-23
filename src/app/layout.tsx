import type { Metadata } from 'next';
import './globals.css';
import { HouseProvider } from '../context/HouseContext';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  title: 'HouseManagement — Co-living Without The Drama | RoomJustice AI',
  description: 'The algorithmic fairness operating system for roommates and university shared housing. M-Pesa parsing, dietary splits, envy-free chores, and AI arbitration.',
  keywords: ['roommates', 'cost sharing', 'm-pesa split', 'kenya roommates', 'fair chore rotation', 'student housing'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-white text-slate-800">
        <HouseProvider>
          <AppShell>{children}</AppShell>
        </HouseProvider>
      </body>
    </html>
  );
}
