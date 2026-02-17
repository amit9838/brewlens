import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ThemeToggle } from '@/src/components/ui/theme-toggle';
const inter = Inter({ subsets: ['latin'] });
import './globals.css';

export const metadata: Metadata = {
  title: 'BrewLens - Homebrew Casks & Formulae Explorer',
  description: 'Modern web-based explorer for Homebrew packages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-zinc-200 dark:bg-zinc-950">
            <header className=" bg-zinc-300 dark:bg-zinc-900">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold ">
                  <span className='text-zinc-900 dark:text-zinc-50'>
                    Brew
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-normal"> Lens</span>
                </h1>
                <ThemeToggle />
              </div>
            </header>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}