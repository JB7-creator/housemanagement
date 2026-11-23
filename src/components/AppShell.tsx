'use client';

import React from 'react';
import { AppNavigation } from './AppNavigation';
import { FooterSection } from './FooterSection';
import { MpesaPasteModal } from './MpesaPasteModal';
import { WorkspaceModal } from './WorkspaceModal';
import { useHouse } from '../context/HouseContext';
import { Sparkles } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    roommates,
    handleAddExpense,
    isMpesaModalOpen,
    setIsMpesaModalOpen,
    isWorkspaceModalOpen,
    setIsWorkspaceModalOpen,
    workspaceModalMode,
    activeWorkspace,
    handleCreateWorkspace,
    handleInviteRoommate,
    toastMessage,
  } = useHouse();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-champagne-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top 2-Tier Navigation */}
      <AppNavigation />

      {/* Page Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Communal Footer */}
      <FooterSection />

      {/* Modals */}
      <MpesaPasteModal
        isOpen={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        roommates={roommates}
        onAddExpense={handleAddExpense}
      />

      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        mode={workspaceModalMode}
        activeWorkspace={activeWorkspace}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
        onInviteRoommate={handleInviteRoommate}
      />
    </div>
  );
}
