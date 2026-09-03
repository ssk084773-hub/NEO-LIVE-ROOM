import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/AndroidFrame';
import { NavigationBar } from './components/NavigationBar';
import { HomeScreen } from './components/HomeScreen';
import { ExploreLiveScreen } from './components/ExploreLiveScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LiveRoomModal } from './components/LiveRoomModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { WalletModal } from './components/WalletModal';
import { AdminModal } from './components/AdminModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AuthModal } from './components/AuthModal';
import { HostApplicationModal } from './components/HostApplicationModal';
import { ReferralModal } from './components/ReferralModal';
import { PolicyModals } from './components/PolicyModals';
import { ReportModal } from './components/ReportModal';
import { NativeCodeExplorerModal } from './components/NativeCodeExplorerModal';
import { ToastAlert } from './components/ToastAlert';
import { MessagesModal } from './components/MessagesModal';
import { LiveRoom } from './types';
import { Lock, X } from 'lucide-react';

function AppContent() {
  const { currentRoom, setCurrentRoom, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'live' | 'messages' | 'profile'>('home');

  // Modals state
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showHostApp, setShowHostApp] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showCodeExplorer, setShowCodeExplorer] = useState(false);
  const [policyTab, setPolicyTab] = useState<'terms' | 'privacy' | 'guidelines' | 'deletion' | null>(null);

  // Report Modal
  const [reportData, setReportData] = useState<{
    targetType: 'user' | 'room';
    targetId: string;
    targetName: string;
  } | null>(null);

  // Private room password prompt
  const [pendingPrivateRoom, setPendingPrivateRoom] = useState<LiveRoom | null>(null);
  const [enteredPassword, setEnteredPassword] = useState('');

  const handleSelectRoom = (room: LiveRoom) => {
    if (room.isPrivate) {
      setPendingPrivateRoom(room);
      setEnteredPassword('');
    } else {
      setCurrentRoom(room);
    }
  };

  const handleConfirmPrivateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPrivateRoom) return;

    if (!pendingPrivateRoom.password || enteredPassword === pendingPrivateRoom.password || enteredPassword === '1234') {
      setCurrentRoom(pendingPrivateRoom);
      setPendingPrivateRoom(null);
    } else {
      addToast('Incorrect Password', 'Please enter the valid room PIN (hint: 1234).', 'warning');
    }
  };

  return (
    <AndroidFrame
      onOpenCodeExplorer={() => setShowCodeExplorer(true)}
      onOpenAdmin={() => setShowAdmin(true)}
      onOpenWallet={() => setShowWallet(true)}
    >
      <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-950">
        {/* Main Viewport Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {activeTab === 'home' && (
            <HomeScreen
              onSelectRoom={handleSelectRoom}
              onOpenLeaderboard={() => setShowLeaderboard(true)}
              onOpenCreateRoom={() => setShowCreateRoom(true)}
              onOpenAuth={() => setShowAuth(true)}
              onOpenWallet={() => setShowWallet(true)}
            />
          )}

          {activeTab === 'live' && (
            <ExploreLiveScreen
              onSelectRoom={handleSelectRoom}
              onOpenCreateRoom={() => setShowCreateRoom(true)}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesModal
              onClose={() => setActiveTab('home')}
              onOpenReport={(type, id, name) => setReportData({ targetType: type, targetId: id, targetName: name })}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              onOpenWallet={() => setShowWallet(true)}
              onOpenHostApp={() => setShowHostApp(true)}
              onOpenReferral={() => setShowReferral(true)}
              onOpenPolicies={tab => setPolicyTab(tab || 'privacy')}
              onOpenAuth={() => setShowAuth(true)}
              onOpenLeaderboard={() => setShowLeaderboard(true)}
            />
          )}
        </div>

        {/* Persistent Bottom Navigation (Hidden when full-screen live stream is active) */}
        {!currentRoom && (
          <NavigationBar
            activeTab={activeTab}
            onTabChange={tab => setActiveTab(tab)}
            onOpenCreateRoom={() => setShowCreateRoom(true)}
          />
        )}

        {/* Live Room View (Full screen immersive overlay) */}
        {currentRoom && (
          <div className="absolute inset-0 z-50">
            <LiveRoomModal
              room={currentRoom}
              onClose={() => setCurrentRoom(null)}
              onOpenRecharge={() => setShowWallet(true)}
              onOpenReport={(type, id, name) => setReportData({ targetType: type, targetId: id, targetName: name })}
            />
          </div>
        )}

        {/* Create Live Stream Modal */}
        {showCreateRoom && (
          <div className="absolute inset-0 z-50">
            <CreateRoomModal onClose={() => setShowCreateRoom(false)} />
          </div>
        )}

        {/* Wallet & Google Play Billing Modal */}
        {showWallet && (
          <div className="absolute inset-0 z-50">
            <WalletModal onClose={() => setShowWallet(false)} />
          </div>
        )}

        {/* Admin Dashboard Modal */}
        {showAdmin && (
          <div className="absolute inset-0 z-50">
            <AdminModal onClose={() => setShowAdmin(false)} />
          </div>
        )}

        {/* Hall of Fame / Leaderboard Modal */}
        {showLeaderboard && (
          <div className="absolute inset-0 z-50">
            <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
          </div>
        )}

        {/* Auth / Profile Modal */}
        {showAuth && (
          <div className="absolute inset-0 z-50">
            <AuthModal onClose={() => setShowAuth(false)} />
          </div>
        )}

        {/* Creator / Host Application Modal */}
        {showHostApp && (
          <div className="absolute inset-0 z-50">
            <HostApplicationModal onClose={() => setShowHostApp(false)} />
          </div>
        )}

        {/* Referral Program Modal */}
        {showReferral && (
          <div className="absolute inset-0 z-50">
            <ReferralModal onClose={() => setShowReferral(false)} />
          </div>
        )}

        {/* Policies (Privacy, Terms, Guidelines, Deletion) */}
        {policyTab && (
          <div className="absolute inset-0 z-50">
            <PolicyModals initialTab={policyTab} onClose={() => setPolicyTab(null)} />
          </div>
        )}

        {/* Report / Moderation Modal */}
        {reportData && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <ReportModal
                targetType={reportData.targetType}
                targetId={reportData.targetId}
                targetName={reportData.targetName}
                onClose={() => setReportData(null)}
              />
            </div>
          </div>
        )}

        {/* Native Android Kotlin & Architecture Explorer */}
        {showCodeExplorer && (
          <div className="absolute inset-0 z-50">
            <NativeCodeExplorerModal onClose={() => setShowCodeExplorer(false)} />
          </div>
        )}

        {/* Private Room PIN Prompt */}
        {pendingPrivateRoom && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-slate-900 border border-purple-500/40 rounded-2xl p-4 text-white shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-xs">Private Live Stream</h4>
                </div>
                <button
                  onClick={() => setPendingPrivateRoom(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-300">
                This room is password-protected by @{pendingPrivateRoom.hostName}. Enter the entry PIN:
              </p>

              <form onSubmit={handleConfirmPrivateRoom} className="space-y-3">
                <input
                  type="password"
                  required
                  autoFocus
                  value={enteredPassword}
                  onChange={e => setEnteredPassword(e.target.value)}
                  placeholder="PIN Code (Default: 1234)"
                  className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-3 py-2 text-center text-sm tracking-widest font-mono text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-xs rounded-xl text-white shadow hover:brightness-110 active:scale-95 transition"
                >
                  Unlock & Join
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Universal In-App Toast & Push Alerts */}
        <ToastAlert />
      </div>
    </AndroidFrame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
