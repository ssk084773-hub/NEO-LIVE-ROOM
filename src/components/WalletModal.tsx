import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coins,
  Gem,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Building2,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COIN_PACKAGES } from '../data/mockData';
import { WithdrawalRequest } from '../types';

interface WalletModalProps {
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {
  const {
    coins,
    diamonds,
    transactions,
    rechargeCoins,
    requestWithdrawal,
    withdrawalRequests,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'recharge' | 'withdraw' | 'history'>('recharge');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(COIN_PACKAGES[1].id);
  const [isProcessingRecharge, setIsProcessingRecharge] = useState(false);

  // Withdrawal form
  const [withdrawAmountUsd, setWithdrawAmountUsd] = useState<number>(25);
  const [withdrawMethod, setWithdrawMethod] = useState<WithdrawalRequest['method']>('PayPal');
  const [accountDetails, setAccountDetails] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  const earningsUsd = (diamonds / 100).toFixed(2);

  const handleRecharge = async () => {
    const pkg = COIN_PACKAGES.find(p => p.id === selectedPackageId);
    if (!pkg) return;

    setIsProcessingRecharge(true);
    await rechargeCoins(pkg.id, pkg.coins + pkg.bonusCoins, pkg.priceUsd);
    setIsProcessingRecharge(false);
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountDetails.trim()) return;

    setIsSubmittingWithdraw(true);
    await requestWithdrawal(withdrawAmountUsd, withdrawMethod, accountDetails.trim());
    setIsSubmittingWithdraw(false);
    setAccountDetails('');
    setActiveTab('history');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">NEO Wallet & Earnings</h3>
            <p className="text-[11px] text-slate-400">Google Play Billing & Creator Ledger</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Balance Summary Card */}
      <div className="p-4 pb-2">
        <div className="grid grid-cols-2 gap-3">
          {/* User Coins */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300">My Coins</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {coins.toLocaleString()}
            </div>
            <p className="text-[10px] text-amber-300/70 mt-1">Used for gifts and stream interactions</p>
          </div>

          {/* Creator Diamonds / Earnings */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/15 via-slate-900 to-slate-900 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-300">Creator Earnings</span>
              <Gem className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              ${earningsUsd}
            </div>
            <p className="text-[10px] text-purple-300/70 mt-1">
              {diamonds.toLocaleString()} Diamonds (100 = $1)
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-2">
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('recharge')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'recharge'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Recharge Coins
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'withdraw'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Withdraw Payout
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ledger History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'recharge' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Coin Package (Google Play)
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Play Billing 6.2 Certified</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {COIN_PACKAGES.map(pkg => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-3 rounded-xl border text-left relative transition-all ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {pkg.badge && (
                      <span className="absolute top-2 right-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950">
                        {pkg.badge}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span className="font-extrabold text-base text-white">
                        {(pkg.coins + pkg.bonusCoins).toLocaleString()}
                      </span>
                    </div>
                    {pkg.bonusCoins > 0 && (
                      <span className="text-[10px] text-pink-400 font-semibold block mt-0.5">
                        Includes {pkg.bonusCoins} Bonus
                      </span>
                    )}
                    <div className="mt-2 text-xs font-bold text-slate-200">
                      ${pkg.priceUsd.toFixed(2)} USD
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Google Play Checkout Button */}
            <button
              onClick={handleRecharge}
              disabled={isProcessingRecharge}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/20 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isProcessingRecharge
                  ? 'Confirming with Google Play...'
                  : `Purchase with Google Play Billing`}
              </span>
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Purchases are processed securely via Google Play Billing. Virtual coins are non-refundable and have no cash value outside platform gifting.
            </p>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="space-y-4">
            {/* Transparent Earning Disclaimer */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-300 leading-relaxed">
                <span className="font-bold text-white">Creator Earning Policy: </span>
                Earnings are accrued solely from eligible live stream gifts. Earnings are not guaranteed income and depend on platform rules, compliance, and user activity. Minimum withdrawal is $25.00 USD.
              </div>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Withdrawal Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="25"
                    max={Math.floor(diamonds / 100)}
                    value={withdrawAmountUsd}
                    onChange={e => setWithdrawAmountUsd(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Requires {withdrawAmountUsd * 100} Diamonds</span>
                  <span>Available: ${earningsUsd} USD</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Payout Method
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['PayPal', 'Bank Transfer', 'Wise', 'UPI'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setWithdrawMethod(method)}
                      className={`py-2 px-1 text-[11px] font-bold rounded-lg border text-center transition ${
                        withdrawMethod === method
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Recipient Account Details ({withdrawMethod})
                </label>
                <input
                  type="text"
                  required
                  value={accountDetails}
                  onChange={e => setAccountDetails(e.target.value)}
                  placeholder={
                    withdrawMethod === 'PayPal'
                      ? 'paypal@email.com'
                      : withdrawMethod === 'UPI'
                      ? 'username@upi'
                      : 'IBAN / Routing & Account No'
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingWithdraw || diamonds < withdrawAmountUsd * 100 || withdrawAmountUsd < 25}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow hover:brightness-110 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmittingWithdraw ? 'Submitting Request...' : `Request $${withdrawAmountUsd} USD Payout`}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Immutable Ledger History
            </h4>

            {transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No transactions recorded yet.
              </div>
            ) : (
              transactions.map(tx => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl ${
                        tx.type === 'recharge' || tx.type === 'gift_received'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {tx.type === 'recharge' || tx.type === 'gift_received' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{tx.note}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>ID: {tx.id.slice(0, 16)}</span>
                        <span>•</span>
                        <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xs font-extrabold ${
                        tx.type === 'recharge' || tx.type === 'gift_received'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'recharge' || tx.type === 'gift_received' ? '+' : '-'}
                      {tx.currency === 'usd' ? `$${tx.amount.toFixed(2)}` : tx.amount.toLocaleString()}{' '}
                      <span className="text-[9px] uppercase">{tx.currency}</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${
                        tx.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : tx.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
