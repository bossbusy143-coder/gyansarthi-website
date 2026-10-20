import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, Smartphone, CheckCircle2 } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'button' | 'card';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'button',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  // If already installed and running standalone, hide install UI
  if (isInstalled) {
    return null;
  }

  // If not installable and not iOS, show clean fallback on desktop or return null
  const handleClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      await install();
      setInstalling(false);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General instructions for browsers that don't trigger beforeinstallprompt yet
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${className}`}
          title="Install GyanSarthi App on your phone/device"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Install App</span>
        </button>
      )}

      {variant === 'button' && (
        <button
          onClick={handleClick}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Install GyanSarthi App</span>
        </button>
      )}

      {variant === 'card' && (
        <div className={`p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-sky-500/10 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/25">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                Install GyanSarthi App
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Fast loading, offline revision & full screen
              </p>
            </div>
          </div>

          <button
            onClick={handleClick}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 shadow-xs transition-colors cursor-pointer"
          >
            Install
          </button>
        </div>
      )}

      {/* iOS & Manual Installation Instruction Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Install GyanSarthi App
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add to your home screen
                </p>
              </div>
            </div>

            <div className="space-y-3 py-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Step 1: Tap Share / Menu</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Safari ya browser toolbar me <strong>Share</strong> icon ya 3-dots menu par tap karein.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Step 2: Add to Home Screen</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Options me scroll karke <strong>"Add to Home Screen"</strong> / <strong>"Install App"</strong> chunein.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Step 3: Tap Add / Confirm</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Upar <strong>"Add"</strong> dabayein. GyanSarthi aapke phone par native app ban jayegi!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
