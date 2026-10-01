import React, { useEffect, useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallAppModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running as standalone app
    const isStandalone =
      (typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(display-mode: standalone)').matches) ||
      Boolean((window.navigator as any)?.standalone);
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        onClose();
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Smartphone className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Install FitTrack App</h3>
            <p className="text-xs text-slate-500">Run as a fast, standalone mobile or desktop app</p>
          </div>
        </div>

        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>FitTrack is already installed on this device!</span>
          </div>
        ) : deferredPrompt ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Install <strong>FitTrack</strong> on your phone or computer to use it offline, without browser bars, with fast one-tap access from your home screen.
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen</span>
            </button>
          </div>
        ) : isIOS ? (
          <div className="space-y-4 text-sm text-slate-600">
            <p className="leading-relaxed">
              To install <strong>FitTrack</strong> on your iPhone or iPad:
            </p>
            <ol className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">1</span>
                <span>Open this page in <strong>Safari</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">2</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Tap the <Share2 className="w-3.5 h-3.5 text-sky-600 inline" /> <strong>Share</strong> button at the bottom of the screen.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">3</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-slate-800 inline" /> <strong>Add to Home Screen</strong>.
                </span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-slate-600">
            <p className="leading-relaxed">
              You can install FitTrack as a native app on Chrome, Edge, Safari, or Android:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
              <p>• <strong>Chrome / Edge / Brave:</strong> Click the <Download className="w-3.5 h-3.5 inline text-emerald-600" /> <strong>Install</strong> icon in the right side of the address bar.</p>
              <p>• <strong>Android:</strong> Tap the 3 dots menu (⋮) and tap <strong>Add to Home screen</strong>.</p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
