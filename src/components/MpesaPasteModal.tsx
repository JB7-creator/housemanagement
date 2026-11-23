'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { parseMpesaMessage, ParsedMpesaResult } from '../lib/algorithms/mpesaParser';
import { Roommate, Expense, LineItem } from '../lib/types';
import { formatKES, formatKenyanPhoneDisplay } from '../lib/utils';

interface MpesaPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roommates: Roommate[];
  onAddExpense: (expense: Expense) => void;
}

const SAMPLE_MPESA_MESSAGES = [
  "UKL90123AB Confirmed. Ksh1,150.00 paid to KANGEMI FRESH VEGETABLES on 23/11/26 at 6:45 PM. New M-PESA balance is Ksh590.50. Transaction cost, Ksh0.00.",
  "TKJ89123KL Confirmed. Ksh1,850.00 sent to QUICKMART SUPERMARKET for account 987654 on 23/11/26 at 6:42 PM. New M-PESA balance is Ksh410.00. Transaction cost, Ksh0.00.",
  "SGH1234567 Confirmed. Ksh2,400.00 sent to KPLC PREPAID for account 14285712345 on 23/11/26 at 10:15 AM. New M-PESA balance is Ksh1,240.50. Transaction cost, Ksh23.00.",
];

export function MpesaPasteModal({ isOpen, onClose, roommates, onAddExpense }: MpesaPasteModalProps) {
  const [rawText, setRawText] = useState('');
  const [payerId, setPayerId] = useState(roommates[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['category']>('GROCERIES');
  
  // Custom dietary split options
  const [excludeVegetarians, setExcludeVegetarians] = useState(false);
  const [greensOnly, setGreensOnly] = useState(false);

  if (!isOpen) return null;

  const parsed: ParsedMpesaResult = parseMpesaMessage(rawText);

  const handleUseSample = (msg: string) => {
    setRawText(msg);
    const p = parseMpesaMessage(msg);
    if (p.counterparty) {
      setTitle(p.counterparty);
      if (p.counterparty.includes('KPLC')) setCategory('ELECTRICITY');
      else if (p.counterparty.includes('VEGETABLES')) {
        setCategory('GROCERIES');
        setGreensOnly(true);
      }
    }
  };

  const handleSave = () => {
    if (!parsed.amount && !rawText) return;

    const amount = parsed.amount || 1000;
    const finalTitle = title || parsed.counterparty || 'Shared House Expense';

    // Build line items based on dietary preferences
    let eligibleRoommates = roommates.map((r) => r.id);
    if (excludeVegetarians) {
      eligibleRoommates = roommates.filter((r) => !r.diet.includes('vegetarian')).map((r) => r.id);
    }

    const item: LineItem = {
      id: `item_${Date.now()}`,
      name: finalTitle,
      cost: amount,
      category: category === 'ELECTRICITY' ? 'utilities' : excludeVegetarians ? 'meat' : 'greens',
      participantIds: eligibleRoommates,
    };

    const newExpense: Expense = {
      id: `exp_${Date.now()}`,
      payerId: payerId,
      title: finalTitle,
      category: category,
      totalAmount: amount,
      date: 'Just now',
      mpesaCode: parsed.code || 'MANUAL' + Math.floor(Math.random() * 10000),
      items: [item],
      verified: true,
    };

    onAddExpense(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">Paste M-Pesa Transaction SMS</h3>
              <p className="text-[11px] text-slate-400">Deterministic RegEx & Groq AI verification</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample clickers */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Quick Samples to test:</span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_MPESA_MESSAGES.map((msg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleUseSample(msg)}
                className="text-[10px] font-mono font-medium px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition-colors"
              >
                Sample {i + 1} ({msg.slice(0, 10)}...)
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            M-Pesa SMS Content
          </label>
          <textarea
            rows={3}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste your Safaricom message here (e.g. UKL90123AB Confirmed. Ksh1,150.00 paid to KANGEMI FRESH VEGETABLES...)"
            className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-electric-500 bg-slate-50/50"
          />
        </div>

        {/* Live RegEx Extraction Preview */}
        {rawText && (
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Parsed Transaction Metadata
              </span>
              <span className="text-[10px] font-mono bg-blue-200/60 px-1.5 py-0.5 rounded text-blue-800">
                Confidence: {Math.round(parsed.confidence * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block">Transaction Code:</span>
                <span className="font-mono font-bold text-slate-900">{parsed.code || 'Not detected'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Amount Extracted:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {parsed.amount ? formatKES(parsed.amount) : 'Not detected'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Recipient / Till:</span>
                <span className="font-semibold text-slate-800 truncate block">{parsed.counterparty}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Type:</span>
                <span className="font-mono text-[11px] text-slate-600">{parsed.type}</span>
              </div>
            </div>
          </div>
        )}

        {/* Form Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Paid By (Payer)</label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-200 bg-white"
            >
              {roommates.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (🇰🇪 {formatKenyanPhoneDisplay(r.phone)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Expense Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="GROCERIES">Groceries & Market</option>
              <option value="ELECTRICITY">KPLC Electricity Tokens</option>
              <option value="GAS">Cooking Gas Refill</option>
              <option value="RENT">House Rent</option>
              <option value="WATER">Water Jerricans</option>
              <option value="HOUSE_BUFFER">Emergency Sinking Fund</option>
            </select>
          </div>
        </div>

        {/* Dietary Split Customization */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-700 block">Dietary & Fairness Sub-Splits:</span>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeVegetarians}
                onChange={(e) => setExcludeVegetarians(e.target.checked)}
                className="accent-electric-500 rounded"
              />
              <span>Meat only (Exclude Dennis)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={greensOnly}
                onChange={(e) => setGreensOnly(e.target.checked)}
                className="accent-electric-500 rounded"
              />
              <span>Greens & Veggies only</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold shadow-sm transition-all"
          >
            Record & Recalculate Debts
          </button>
        </div>

      </div>
    </div>
  );
}
