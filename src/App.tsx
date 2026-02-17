import './App.css'
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { X } from 'lucide-react'
import { Modal } from './components/ui/Modal';
import { Footer } from './components/layout/Footer';
import { NavDrawer } from './components/layout/Drawer';
import { Header } from './components/layout/Header';
import { BrewList } from './components/page/BrewList';
import { type BrewType } from "./types";
import { Routes, Route } from 'react-router-dom';
import { CaskDetail } from './components/page/CaskDetail';
import Installation from './components/page/installation';
import FormulaeDetail from './components/page/FormulaeDetail';

const queryClient = new QueryClient();

function HomebrewExplorer() {
  const [modalItem, setModalItem] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [search, setSearch] = useState('');
  const [type, setType] = useState<BrewType>('cask');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-gray-100 p-4 sm:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <NavDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} onShowInstallGuide={() => setIsOpen(true)} />

        {/* HEADER */}
        <Header type={type} search={search} setSearch={setSearch} setIsOpen={setIsOpen} />
        <Routes>
          <Route path="/install" element={<div>Install Guide</div>} />
          {/* <BrewList search={search} setSearch={setSearch} type={type} setType={setType} /> */}
          <Route path="/brewlens" element={<BrewList search={search} setSearch={setSearch} type={type} setType={setType} />} />
          <Route path="/installation" element={<Installation />} />
          <Route path="/cask/:token" element={<CaskDetail />} />
          <Route path="/formula/:token" element={<FormulaeDetail />} />
        </Routes>

        {/* Footer */}
        <Footer />
        {/* JSON MODAL */}
        <Modal isOpen={!!modalItem} onClose={() => setModalItem(null)}>
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h3 className="font-bold">Raw JSON</h3>
            <button onClick={() => setModalItem(null)}><X size={20} /></button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-black overflow-auto max-h-[60vh]">
            <pre className="text-xs font-mono text-gray-600 dark:text-gray-400">{JSON.stringify(modalItem, null, 2)}</pre>
          </div>
        </Modal>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomebrewExplorer />
    </QueryClientProvider>
  );
}