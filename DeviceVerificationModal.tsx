import React, { useState, useEffect } from 'react';
import { deviceVerificationService } from '../services/deviceVerificationService';
import { Loader2, CheckCircle2, AlertCircle, HelpCircle, ExternalLink, X, Copy } from 'lucide-react';

interface DeviceVerificationModalProps {
  isOpen: boolean;
  onVerified: () => void;
}

export const DeviceVerificationModal: React.FC<DeviceVerificationModalProps> = ({
  isOpen,
  onVerified,
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Auto-fill from clipboard on load or when user taps clipboard button
  const handleTryPasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        const cleaned = text.trim();
        if (cleaned.length >= 4) {
          setKeyInput(cleaned);
          setErrorMsg(null);
        }
      }
    } catch {
      // Clipboard access denied, silent fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleTryPasteClipboard();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. "Get Key" action: Request Arolinks shortlink -> Open in new tab
  const handleGetKey = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsGenerating(true);

    try {
      const res = await deviceVerificationService.requestKeyLink();
      if (res.success && res.shortenedUrl) {
        // Open Arolinks shortened URL (which leads to user Google Translate page with gyan-XXXX code)
        window.open(res.shortenedUrl, '_blank', 'noopener,noreferrer');
        setSuccessMsg('Arolinks open ho gaya! Verification complete karne par Google Translate se mila code copy karein.');
      } else {
        setErrorMsg('Key link generate nahi ho saka. Kripya punah prayas karein.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Key request error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. "join" action: Open Telegram channel
  const handleJoinTelegram = () => {
    window.open('https://t.me/gyansarthi_gyanboss', '_blank', 'noopener,noreferrer');
  };

  // 3. "Verify" action: Check dynamic code (e.g. gyan-2310, gyan-XXXX)
  const handleVerify = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleaned = keyInput.trim();
    if (!cleaned) {
      setErrorMsg('Kripya Google Translate se mila code paste karein (jaise: gyan-2310)!');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await deviceVerificationService.verifyKey(cleaned);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onVerified();
        }, 800);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Verification failed. Try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
      {/* Modal Dialog Card (Matching reference design) */}
      <div 
        className="w-full max-w-[360px] rounded-[32px] p-6 sm:p-7 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(225,29,72,0.25)] border border-white/10"
        style={{
          background: 'linear-gradient(180deg, #740c24 0%, #460817 48%, #140b1a 82%, #0d0914 100%)',
        }}
      >
        {/* Top Info Button (i) */}
        <button
          type="button"
          onClick={() => setShowInfo(prev => !prev)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-600/40 hover:bg-slate-600/60 border border-white/15 flex items-center justify-center text-white/90 text-sm font-serif italic transition-all cursor-pointer shadow-inner active:scale-95"
          title="How To Get Key Instructions"
          aria-label="How To Get Key"
        >
          i
        </button>

        {/* Header: Avatar + Title */}
        <div className="flex items-center gap-3.5 pr-8">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 border-white/90 shadow-md overflow-hidden bg-slate-900 shrink-0 flex items-center justify-center">
            {!avatarError ? (
              <img
                src="/avatar.jpg"
                alt="Gyan Sarthi Avatar"
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center text-white font-bold text-2xl">
                GS
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm font-sans leading-none">
              Gyan Sarthi
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-200/90 font-medium leading-snug mt-1.5">
              Device Verification Required
            </p>
          </div>
        </div>

        {/* Info Overlay / Helper Accordion */}
        {showInfo && (
          <div className="mt-4 p-3.5 rounded-2xl bg-black/60 border border-white/15 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <h4 className="font-bold text-rose-400 mb-1.5 flex items-center gap-1">
              <span>📌 Kaise Unlock Karein (How to Get Key)?</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 leading-relaxed">
              <li>Neeche <strong>"Get Key"</strong> button par click karein.</li>
              <li><strong>Arolinks</strong> ka short verification pura karke 'Get Link' dabayein.</li>
              <li>Aapka <strong>Google Translate</strong> page khulega jahan translation box me <strong>gyan-XXXX</strong> jaisa code milega.</li>
              <li>Wahan se code copy karein (jaise: <strong>gyan-2310</strong>).</li>
              <li>Yahan <strong>"Paste Key Here"</strong> me paste karke <strong>"Verify"</strong> dabayein.</li>
              <li>Website aapke phone me <strong>24 Ghante (24h)</strong> ke liye unlock ho jayegi!</li>
            </ol>
          </div>
        )}

        {/* Input Field: "Paste Key Here" */}
        <div className="mt-6 mb-4 relative">
          <div className="w-full h-12 sm:h-13 px-4 rounded-2xl bg-[#1b0610]/90 border border-[#521326] focus-within:border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all flex items-center justify-between">
            <input
              type="text"
              value={keyInput}
              onChange={(e) => {
                const val = e.target.value.slice(0, 20);
                setKeyInput(val);
                if (errorMsg) setErrorMsg(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleVerify();
                }
              }}
              maxLength={20}
              placeholder="Paste Key Here"
              className="w-full bg-transparent text-center font-medium text-base text-white placeholder-[#9c6a78] outline-none tracking-wider selection:bg-rose-600 font-mono"
            />
            {/* Quick Clipboard Paste Button */}
            <button
              type="button"
              onClick={handleTryPasteClipboard}
              className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition-colors shrink-0"
              title="Paste from clipboard"
            >
              <Copy className="w-4 h-4 opacity-70 hover:opacity-100" />
            </button>
          </div>
        </div>

        {/* Action Buttons Row: [Get Key] and [join] */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={handleGetKey}
            disabled={isGenerating}
            className="h-11 rounded-full bg-[#201d2d] hover:bg-[#2c283f] active:scale-95 text-[#3b82f6] hover:text-[#60a5fa] font-semibold text-sm transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#3b82f6]" />
                <span>Opening...</span>
              </>
            ) : (
              <span>Get Key</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleJoinTelegram}
            className="h-11 rounded-full bg-[#201d2d] hover:bg-[#2c283f] active:scale-95 text-[#3b82f6] hover:text-[#60a5fa] font-semibold text-sm transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            title="Join Official Telegram: @gyansarthi_gyanboss"
          >
            <span>join</span>
          </button>
        </div>

        {/* Main "Verify" Button */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full h-12 rounded-full font-bold text-base text-white transition-all active:scale-[0.98] flex items-center justify-center shadow-lg cursor-pointer bg-gradient-to-r from-[#e52d27] via-[#b31217] to-[#1f0409] hover:brightness-110 shadow-red-950/60 disabled:opacity-75"
        >
          {isVerifying ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            <span>Verify</span>
          )}
        </button>

        {/* Error / Success Status Feedback */}
        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span className="leading-tight">{successMsg}</span>
          </div>
        )}

        {/* 24-Hour Timer note */}
        <p className="mt-3 text-[11px] text-center text-slate-400/80 font-medium">
          Key is valid for 24 hours of uninterrupted access.
        </p>
      </div>
    </div>
  );
};
