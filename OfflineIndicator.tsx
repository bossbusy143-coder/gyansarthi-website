import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-amber-600/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/40 animate-in slide-in-from-bottom duration-300">
      <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
      <span>Offline Mode — Cached study materials are accessible.</span>
    </div>
  );
};
