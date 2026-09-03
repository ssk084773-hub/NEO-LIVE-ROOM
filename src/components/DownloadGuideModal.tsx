import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Terminal,
  ExternalLink,
  Check,
  Copy,
  X,
  AlertTriangle,
  Layers,
  Sparkles,
  HelpCircle,
  Laptop
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DownloadGuideModalProps {
  onClose: () => void;
  onOpenCodeExplorer?: () => void;
}

export const DownloadGuideModal: React.FC<DownloadGuideModalProps> = ({
  onClose,
  onOpenCodeExplorer,
}) => {
  const { addToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'mobile' | 'apk' | 'faq'>('mobile');

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        addToast('ইনস্টলেশন সফল!', 'NEO Live Room আপনার ডিভাইসে ইনস্টল হচ্ছে।', 'success');
      }
      setInstallPrompt(null);
    } else {
      addToast(
        'ইনস্টল পদ্ধতি',
        'ব্রাউজারের উপরের ৩টি ডট ( ⋮ ) মেনুতে গিয়ে "Install app" বা "Add to Home screen" চাপুন।',
        'info'
      );
    }
  };

  const copyBuildCommand = () => {
    navigator.clipboard.writeText('cd android && ./gradlew assembleRelease');
    setCopied(true);
    addToast('কমান্ড কপি করা হয়েছে', 'cd android && ./gradlew assembleRelease', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                অ্যাপস ডাউনলোড ও ইনস্টল সহায়িকা
              </h3>
              <p className="text-xs text-slate-400">
                কেন সরাসরি APK ডাউনলোড হচ্ছে না এবং কীভাবে ফোনে চালাবেন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'mobile'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>ফোনে ইনস্টল (PWA)</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'apk'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>আসল APK বিল্ড</span>
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'faq'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>কেন ডাউনলোড হয় না?</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-300 text-xs sm:text-sm">
          {activeTab === 'mobile' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm mb-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>কোনো APK ফাইল ছাড়াই এক ক্লিকে ফোনে ইনস্টল করুন!</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  আপনার মোবাইল ফোনের ব্রাউজার (Google Chrome) দিয়ে এই অ্যাপ্লিকেশনটি কোনো ফাইল ডাউনলোড ছাড়াই সরাসরি একটি অ্যান্ড্রয়েড অ্যাপ হিসেবে আপনার ফোনের হোমস্ক্রিনে ইনস্টল হয়ে যাবে।
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
                  ইনস্টল করার সহজ নিয়ম:
                </h4>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                    ১
                  </div>
                  <div>
                    <span className="font-semibold text-white">মোবাইলে ওপেন করুন:</span>
                    <p className="text-slate-400 text-xs mt-0.5">
                      আপনার ফোনের <strong>Google Chrome</strong> ব্রাউজারে এই অ্যাপটির লিঙ্কটি ওপেন করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                    ২
                  </div>
                  <div>
                    <span className="font-semibold text-white">মেনু অপশনে চাপুন:</span>
                    <p className="text-slate-400 text-xs mt-0.5">
                      ক্রোম ব্রাউজারের উপরে ডানদিকের <strong>তিনটি ডট ( ⋮ )</strong> মেনুতে ক্লিক করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                    ৩
                  </div>
                  <div>
                    <span className="font-semibold text-white">Install App / Add to Home screen:</span>
                    <p className="text-slate-400 text-xs mt-0.5">
                      <strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> (হোম স্ক্রিনে যোগ করুন) চাপুন। অ্যাপটি সরাসরি আপনার ফোনের অ্যাপ ড্রয়ার ও হোমস্ক্রিনে আইকন হিসেবে ইনস্টল হয়ে যাবে!
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleInstallPWA}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                <span>সরাসরি ডিভাইসে ইনস্টল করুন</span>
              </button>
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white text-sm">আসল APK ফাইল তৈরি ও পাওয়ার নিয়ম:</span>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  আপনার প্রজেক্টে সম্পূর্ণ কম্পাইলেবল অ্যান্ড্রয়েড ফাইলগুলো (Kotlin, Gradle, Manifest, Jetpack Compose) তৈরি করে দেওয়া আছে।
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                    ১
                  </div>
                  <div>
                    <span className="font-semibold text-white">Export to ZIP:</span>
                    <p className="text-slate-400 text-xs mt-0.5">
                      AI Studio-র উপরের সেটিংস বা ফাইল অপশন থেকে <strong>Export to ZIP</strong> বা <strong>Export to GitHub</strong> দিয়ে প্রজেক্টটি কম্পিউটারে নামিয়ে নিন।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                    ২
                  </div>
                  <div>
                    <span className="font-semibold text-white">Android Studio দিয়ে ওপেন করুন:</span>
                    <p className="text-slate-400 text-xs mt-0.5">
                      আনজিপ করার পর <code className="text-purple-300">/android</code> ফোল্ডারটি Android Studio দিয়ে ওপেন করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                    ৩
                  </div>
                  <div>
                    <span className="font-semibold text-white">Build APK:</span>
                    <p className="text-slate-400 text-xs mt-0.5">
                      মেনু থেকে <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> নির্বাচন করলেই আসল রিলিজ APK তৈরি হবে:
                    </p>
                    <code className="block mt-1 p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] border border-slate-800">
                      app/build/outputs/apk/release/app-release.apk
                    </code>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-mono">Terminal কমান্ড:</span>
                  <p className="font-mono text-xs text-purple-300">cd android && ./gradlew assembleRelease</p>
                </div>
                <button
                  onClick={copyBuildCommand}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                </button>
              </div>

              {onOpenCodeExplorer && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCodeExplorer();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-xs border border-purple-500/30 flex items-center justify-center gap-1.5 transition"
                >
                  <Layers className="w-4 h-4" />
                  <span>Android কোড ও ফাইল এক্সপ্লোরার দেখুন</span>
                </button>
              )}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>কেন AI Studio ব্রাউজার থেকে সরাসরি .apk ফাইল ডাউনলোড হয় না?</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Google AI Studio হলো একটি <strong>Web Cloud Sandbox</strong>। এটি ব্রাউজারে একটি লাইভ ওয়েব অ্যাপ্লিকেশন হিসেবে কাজ করে। অ্যান্ড্রয়েড অ্যাপের বাইনারি ফাইল (<code className="text-purple-300">.apk</code>) তৈরি করার জন্য ক্লাউড কনটেইনারে <strong>Java (JDK)</strong> ও <strong>Android SDK/NDK</strong> এর প্রসেসর প্রয়োজন, যা কোনো ওয়েব ব্রাউজার রানটাইমের ভেতর থাকে না।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-white text-xs">কোনো ফেক বা ডামি APK কেন তৈরি করা হয়নি?</span>
                <p className="text-slate-400 text-xs leading-relaxed">
                  আপনার স্পষ্ট নির্দেশ অনুযায়ী কোনো ডামি বা খালি `.apk` ফাইল তৈরি করা হয়নি, কারণ নকল APK ফোনে ইনস্টল করলে "App not installed" বা "Package invalid" দেখায়। এর পরিবর্তে আসল compilable ফাইলগুলো নিখুঁতভাবে তৈরি করে দেওয়া হয়েছে।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-white text-xs">সবচেয়ে দ্রুত উপায় কোনটি?</span>
                <p className="text-slate-400 text-xs leading-relaxed">
                  সবচেয়ে দ্রুততম উপায় হলো মোবাইল Chrome থেকে <strong>"Add to Home screen"</strong> করা। এটি ইনস্টল করার সাথে সাথেই ফুলস্ক্রিনে নেটিভ অ্যাপের মতো কাজ করবে!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>NEO Live Room • Android SDK 35 Ready</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
          >
            বুঝেছি
          </button>
        </div>
      </div>
    </div>
  );
};
