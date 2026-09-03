import React, { useState } from 'react';
import { Sparkles, Shield, User, FileText, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HostApplicationModalProps {
  onClose: () => void;
}

export const HostApplicationModal: React.FC<HostApplicationModalProps> = ({ onClose }) => {
  const { submitCreatorApplication, currentUser } = useApp();

  const [fullName, setFullName] = useState(currentUser.displayName);
  const [govIdType, setGovIdType] = useState('National ID / Passport');
  const [idNumber, setIdNumber] = useState('');
  const [talentCategory, setTalentCategory] = useState('Music');
  const [socialLinks, setSocialLinks] = useState('');
  const [bio, setBio] = useState(currentUser.bio);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms || !idNumber.trim()) return;

    submitCreatorApplication({
      userId: currentUser.id,
      username: currentUser.username,
      fullName,
      governmentIdType: govIdType,
      idNumber: idNumber.trim(),
      socialLinks: socialLinks.trim(),
      bio: bio.trim(),
      talentCategory,
    });

    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Creator & Host Application</h3>
            <p className="text-[11px] text-slate-400">Unlock live broadcasting & diamond earnings</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Legal Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">ID Document Type</label>
            <select
              value={govIdType}
              onChange={e => setGovIdType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="National ID">National ID Card</option>
              <option value="Passport">Passport</option>
              <option value="Driver License">Driver's License</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">ID Document Number</label>
            <input
              type="text"
              required
              value={idNumber}
              onChange={e => setIdNumber(e.target.value)}
              placeholder="e.g. A9821034"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Primary Talent Category</label>
          <select
            value={talentCategory}
            onChange={e => setTalentCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="Music">Music & Singing</option>
            <option value="Gaming">Gaming & Esports</option>
            <option value="Dancing">Dancing & Performance</option>
            <option value="Chat">Podcast & Storytelling</option>
            <option value="Education">Education & Tech Talks</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Social Media Profiles</label>
          <input
            type="text"
            required
            value={socialLinks}
            onChange={e => setSocialLinks(e.target.value)}
            placeholder="Instagram, YouTube, TikTok handles or URLs"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Creator Bio / Pitch</label>
          <textarea
            rows={2}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <label className="flex items-start gap-2 pt-1 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={agreeTerms}
            onChange={e => setAgreeTerms(e.target.checked)}
            className="mt-0.5 rounded border-slate-700 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-[11px] text-slate-400 leading-snug">
            I agree to the Creator Agreement, Community Guidelines, and acknowledge earnings are dependent on eligibility and verified compliance.
          </span>
        </label>

        <button
          type="submit"
          disabled={!agreeTerms || !idNumber.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 font-bold text-xs text-white shadow hover:brightness-110 active:scale-95 transition disabled:opacity-40"
        >
          Submit Creator Verification Application
        </button>
      </form>
    </div>
  );
};
