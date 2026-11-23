'use client';

import React from 'react';
import { AppNavigation } from './AppNavigation';
import { FooterSection } from './FooterSection';
import { MpesaPasteModal } from './MpesaPasteModal';
import { WorkspaceModal } from './WorkspaceModal';
import { AIChatDrawer } from './AIChatDrawer';
import { AuthModal } from './AuthModal';
import { ProfileModal } from './ProfileModal';
import { ReportInfractionModal } from './ReportInfractionModal';
import { WhatsAppPreviewDrawer } from './WhatsAppPreviewDrawer';
import { WelcomeAuthGate } from './WelcomeAuthGate';
import { useHouse } from '../context/HouseContext';
import { Sparkles, Loader2 } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    roommates,
    handleAddExpense,
    isMpesaModalOpen,
    setIsMpesaModalOpen,
    isWorkspaceModalOpen,
    setIsWorkspaceModalOpen,
    workspaceModalMode,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isInfractionModalOpen,
    setIsInfractionModalOpen,
    activeWorkspace,
    handleCreateWorkspace,
    handleInviteRoommate,
    handleJoinWorkspaceByCode,
    toastMessage,
    isAuthenticated,
    isHydrated,
  } = useHouse();

  // Initial loading state while restoring session from localStorage
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <Loader2 className="w-8 h-8 text-electric-500 animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-mono">Restoring your flat environment...</p>
      </div>
    );
  }

  // If not authenticated, require login or registration before entering
  if (!isAuthenticated) {
    return <WelcomeAuthGate />;
  }

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

      {/* Interactive AI Arbitrator Drawer */}
      <AIChatDrawer />

      {/* WhatsApp Bot Simulator (floats above AI drawer) */}
      <WhatsAppPreviewDrawer />

      {/* Auth & Profile Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Infraction Reporter Modal */}
      <ReportInfractionModal
        isOpen={isInfractionModalOpen}
        onClose={() => setIsInfractionModalOpen(false)}
      />

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
        onJoinWorkspace={handleJoinWorkspaceByCode}
      />
    </div>
  );
}
