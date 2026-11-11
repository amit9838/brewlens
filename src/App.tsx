import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Modal } from './components/ui/Modal';
import { ModalProvider } from './components/contexts/ModalContexts';
import { BookmarksProvider } from './components/contexts/BookmarksContext';
import { RecentlyViewedProvider } from './components/contexts/RecentlyViewedContext';
import { SearchPaletteProvider } from './components/ui/SearchPalette';
import { NavDrawer } from './components/layout/Drawer';
import { Header } from './components/layout/Header';
import { BrewList } from './components/page/BrewList';
import { CaskDetail } from './components/page/CaskDetail';
import Installation from './components/page/Installation';
import FormulaeDetail from './components/page/FormulaeDetail';
import About from './components/page/About';
import Analytics from './components/page/Analytics';
import Discover from './components/page/Discover';

const queryClient = new QueryClient();

function Shell() {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();

    // Start each page at the top.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-canvas font-sans text-ink">
            <div className="mx-auto flex max-w-[1506px] flex-col gap-12 px-[clamp(16px,3vw,48px)] pb-12 pt-6">
                <NavDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
                <Header setIsOpen={setIsOpen} isOpen={isOpen} />
                <main className="flex flex-col gap-12">
                    <Routes>
                        <Route path="/" element={<Discover />} />
                        <Route path="/all" element={<BrewList />} />
                        <Route path="/installation" element={<Installation />} />
                        <Route path="/cask/:token" element={<CaskDetail />} />
                        <Route path="/formula/:token" element={<FormulaeDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ModalProvider>
                <BookmarksProvider>
                    <RecentlyViewedProvider>
                        <SearchPaletteProvider>
                            <Shell />
                            <Modal />
                        </SearchPaletteProvider>
                    </RecentlyViewedProvider>
                </BookmarksProvider>
            </ModalProvider>
        </QueryClientProvider>
    );
}
