import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Tv,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  X,
  Ban,
  DollarSign,
  Radio,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AdminModalProps {
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ onClose }) => {
  const {
    rooms,
    creatorApplications,
    adminApproveCreator,
    adminRejectCreator,
    withdrawalRequests,
    adminApproveWithdrawal,
    adminRejectWithdrawal,
    adminBanUser,
    adminForceEndRoom,
    adminBroadcast,
    reports,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'creators' | 'withdrawals' | 'rooms' | 'reports' | 'broadcast'>('creators');
  const [broadcastTitle, setBroadcastTitle] = useState('Platform Update 🚀');
  const [broadcastBody, setBroadcastBody] = useState('');

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastBody.trim()) return;
    adminBroadcast(broadcastTitle, broadcastBody.trim());
    setBroadcastBody('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
      {/* Admin Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-purple-950/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base leading-tight">Admin Console</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                SECURE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Server-Side Authorization Enforced</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metric Counters */}
      <div className="p-4 pb-2 grid grid-cols-4 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Active Streams</span>
          <span className="text-lg font-extrabold text-purple-400">{rooms.length}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Pending Apps</span>
          <span className="text-lg font-extrabold text-amber-400">
            {creatorApplications.filter(a => a.status === 'pending').length}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Payout Queue</span>
          <span className="text-lg font-extrabold text-emerald-400">
            {withdrawalRequests.filter(w => w.status === 'pending').length}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Reports</span>
          <span className="text-lg font-extrabold text-rose-400">{reports.length}</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="px-4 mt-2">
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('creators')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeTab === 'creators' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Creators ({creatorApplications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeTab === 'withdrawals' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Payouts ({withdrawalRequests.filter(w => w.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeTab === 'rooms' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Streams
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeTab === 'reports' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeTab === 'broadcast' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Broadcast
          </button>
        </div>
      </div>

      {/* Tab Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'creators' && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Creator Host Verification Queue
            </h4>
            {creatorApplications.length === 0 ? (
              <div className="text-xs text-slate-500 py-6 text-center">No applications pending.</div>
            ) : (
              creatorApplications.map(app => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 mb-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-white">{app.fullName}</span>
                      <span className="text-[11px] text-purple-400 ml-2">@{app.username}</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        app.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : app.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-0.5 bg-slate-950/60 p-2 rounded-lg">
                    <p>
                      <span className="text-slate-400">Category: </span> {app.talentCategory}
                    </p>
                    <p>
                      <span className="text-slate-400">Govt ID: </span> {app.governmentIdType} (
                      {app.idNumber})
                    </p>
                    <p>
                      <span className="text-slate-400">Bio: </span> {app.bio}
                    </p>
                    <p>
                      <span className="text-slate-400">Social: </span> {app.socialLinks}
                    </p>
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => adminApproveCreator(app.id)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Verify</span>
                      </button>
                      <button
                        onClick={() => adminRejectCreator(app.id)}
                        className="flex-1 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-xs font-bold text-white flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Creator Earnings Payout Queue
            </h4>
            {withdrawalRequests.length === 0 ? (
              <div className="text-xs text-slate-500 py-6 text-center">No withdrawal requests.</div>
            ) : (
              withdrawalRequests.map(w => (
                <div
                  key={w.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 mb-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-emerald-400">${w.amountUsd.toFixed(2)} USD</span>
                      <span className="text-[11px] text-slate-400 ml-2">by @{w.username}</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        w.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : w.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg">
                    <p>
                      <span className="text-slate-400">Method: </span> {w.method}
                    </p>
                    <p>
                      <span className="text-slate-400">Account: </span> {w.accountDetails}
                    </p>
                    <p>
                      <span className="text-slate-400">Diamonds Deducted: </span>{' '}
                      {w.diamondsDeducted.toLocaleString()}
                    </p>
                  </div>

                  {w.status === 'pending' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => adminApproveWithdrawal(w.id)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Process Payout</span>
                      </button>
                      <button
                        onClick={() => adminRejectWithdrawal(w.id, 'Account verification mismatch')}
                        className="flex-1 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-xs font-bold text-white flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline & Refund</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'rooms' && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Active Broadcast Streams
            </h4>
            {rooms.map(room => (
              <div
                key={room.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={room.coverImage}
                    alt={room.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-white truncate max-w-[150px]">
                      {room.title}
                    </h5>
                    <div className="text-[10px] text-slate-400">
                      Host: @{room.hostName} • {room.viewerCount} viewers
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adminForceEndRoom(room.id)}
                    className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-[11px] font-bold text-white flex items-center gap-1"
                  >
                    <Ban className="w-3 h-3" />
                    <span>Force Close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Community Moderation Reports
            </h4>
            {reports.map(r => (
              <div
                key={r.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 mb-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400">Report: {r.reason}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {r.targetType.toUpperCase()}
                  </span>
                </div>
                <div className="text-slate-300">
                  Target: <span className="font-bold text-white">{r.targetName}</span>
                </div>
                <div className="text-slate-400 text-[11px] bg-slate-950/60 p-2 rounded">
                  {r.details}
                </div>
                <div className="pt-1 flex gap-2">
                  <button
                    onClick={() => adminBanUser(r.targetId)}
                    className="px-3 py-1 bg-rose-600 rounded text-[11px] font-bold text-white"
                  >
                    Ban User
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'broadcast' && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Send System Announcement
            </h4>
            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Message Body
                </label>
                <textarea
                  required
                  rows={3}
                  value={broadcastBody}
                  onChange={e => setBroadcastBody(e.target.value)}
                  placeholder="Type broadcast to all online users..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast to Platform</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
