import './App.css'
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Modal } from './components/ui/Modal';
import { ModalProvider } from './components/contexts/ModalContexts';
import { NavDrawer } from './components/layout/Drawer';
import { Header } from './components/layout/Header';
import { BrewList } from './components/page/BrewList';
import { type BrewType } from "./types";
import { Routes, Route } from 'react-router-dom';
import { CaskDetail } from './components/page/CaskDetail';
import Installation from './components/page/Installation';
import FormulaeDetail from './components/page/FormulaeDetail';
import About from './components/page/About';

const queryClient = new QueryClient();

function HomebrewExplorer() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [search, setSearch] = useState('');
  const [type, setType] = useState<BrewType>('cask');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-gray-100 p-4 sm:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <NavDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />

        {/* HEADER */}
        <Header setIsOpen={setIsOpen} />
        <Routes>
          <Route path="/install" element={<div>Install Guide</div>} />
          {/* <BrewList search={search} setSearch={setSearch} type={type} setType={setType} /> */}
          <Route path="/" element={<BrewList search={search} setSearch={setSearch} type={type} setType={setType} />} />
          <Route path="/installation" element={<Installation />} />
          <Route path="/cask/:token" element={<CaskDetail />} />
          <Route path="/formula/:token" element={<FormulaeDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>

        {/* Footer */}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <HomebrewExplorer />
        <Modal />
      </ModalProvider>
    </QueryClientProvider>
  );
}