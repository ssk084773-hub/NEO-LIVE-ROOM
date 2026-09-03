import React, { useState } from 'react';
import { Shield, FileText, AlertTriangle, Trash2, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PolicyModalProps {
  initialTab?: 'terms' | 'privacy' | 'guidelines' | 'deletion';
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalProps> = ({
  initialTab = 'privacy',
  onClose,
}) => {
  const [tab, setTab] = useState<'terms' | 'privacy' | 'guidelines' | 'deletion'>(initialTab);
  const { requestAccountDeletion, addToast } = useApp();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = () => {
    if (confirmText !== 'DELETE') return;
    requestAccountDeletion();
    setIsDeleted(true);
    addToast('Account Queued for Deletion', 'Your data will be permanently wiped in accordance with GDPR/CCPA.', 'warning');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Legal & Platform Trust</h3>
            <p className="text-[11px] text-slate-400">Compliance, Safety & User Rights</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3">
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setTab('privacy')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              tab === 'privacy' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Privacy
          </button>
          <button
            onClick={() => setTab('terms')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              tab === 'terms' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Terms
          </button>
          <button
            onClick={() => setTab('guidelines')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              tab === 'guidelines' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Rules
          </button>
          <button
            onClick={() => setTab('deletion')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              tab === 'deletion' ? 'bg-rose-600 text-white' : 'text-slate-400'
            }`}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 text-xs text-slate-300 space-y-3 leading-relaxed">
        {tab === 'privacy' && (
          <div>
            <h4 className="font-bold text-white text-sm mb-2">NEO Live Room Privacy Policy</h4>
            <p className="mb-2">
              We take user privacy seriously. All video and audio streams are processed using end-to-end encrypted WebRTC / RTC channels.
            </p>
            <h5 className="font-semibold text-purple-300 mt-3 mb-1">1. Data Collected</h5>
            <p>
              Account credentials, username, avatar, transaction ledgers, IP and device identifiers for abuse prevention.
            </p>
            <h5 className="font-semibold text-purple-300 mt-3 mb-1">2. Payment Security</h5>
            <p>
              NEO never stores raw credit/debit card numbers on its servers. All payments are securely tokenized and handled by Google Play Billing.
            </p>
          </div>
        )}

        {tab === 'terms' && (
          <div>
            <h4 className="font-bold text-white text-sm mb-2">Terms of Service</h4>
            <p className="mb-2">
              By accessing NEO Live Room, you agree to abide by international broadcasting laws and Google Play Developer Program policies.
            </p>
            <h5 className="font-semibold text-purple-300 mt-3 mb-1">Creator Earnings Disclaimer</h5>
            <p>
              Earnings from virtual gifts depend solely on legitimate platform interactions, minimum payout thresholds ($25.00 USD), and approved identity verification. Virtual coins have no financial value outside of gifting on the NEO platform.
            </p>
          </div>
        )}

        {tab === 'guidelines' && (
          <div>
            <h4 className="font-bold text-white text-sm mb-2">Community Guidelines</h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li>Zero tolerance for hate speech, harassment, bullying, or illegal content.</li>
              <li>No deceptive practices, artificial viewer manipulation, or fake gifting rings.</li>
              <li>Broadcasters must be at least 18 years old or possess legal guardian authorization.</li>
              <li>Violating rooms will be immediately suspended and reported to authorities if required.</li>
            </ul>
          </div>
        )}

        {tab === 'deletion' && (
          <div className="space-y-3">
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-start gap-2 text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Permanent Account Deletion (GDPR/CCPA):</span>
                Deleting your account will permanently wipe your profile, follower lists, coins, and transaction history. This action cannot be reversed.
              </div>
            </div>

            {!isDeleted ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  To confirm, please type <span className="text-rose-400 font-mono">DELETE</span> below:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                />
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== 'DELETE'}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs disabled:opacity-30 transition flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Permanently Delete My Account</span>
                </button>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center space-y-2 text-emerald-300">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <h5 className="font-bold text-sm">Account Deletion Scheduled</h5>
                <p className="text-[11px] text-slate-300">
                  Your profile and personal data have been scrubbed from active directories.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
