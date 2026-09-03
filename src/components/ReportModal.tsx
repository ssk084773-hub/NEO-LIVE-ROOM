import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReportModalProps {
  targetType: 'user' | 'room';
  targetId: string;
  targetName: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  targetType,
  targetId,
  targetName,
  onClose,
}) => {
  const { submitReport } = useApp();
  const [reason, setReason] = useState('Inappropriate Content / Behavior');
  const [details, setDetails] = useState('');

  const reasons = [
    'Inappropriate Content / Behavior',
    'Harassment or Hate Speech',
    'Spam or Scam Promotion',
    'Copyright or Piracy Infringement',
    'Deceptive or Artificial Activity',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(targetType, targetId, targetName, reason, details);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Report {targetType === 'room' ? 'Live Room' : 'User'}</h4>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{targetName}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pt-3 space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Reason for Report</label>
          <div className="space-y-1.5">
            {reasons.map(r => (
              <label
                key={r}
                className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition ${
                  reason === r
                    ? 'bg-rose-950/30 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="text-rose-500 focus:ring-rose-500"
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Additional Evidence or Timestamp (Optional)
          </label>
          <textarea
            rows={3}
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="Please specify what occurred..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white shadow active:scale-95 transition"
        >
          Submit to Trust & Safety Team
        </button>
      </form>
    </div>
  );
};
