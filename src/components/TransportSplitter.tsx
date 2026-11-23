'use client';

import React, { useState } from 'react';
import { Car, Users, Plus, CheckCircle2, Navigation, ArrowRight } from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import { formatKES } from '../lib/utils';
import { LineItem, Expense } from '../lib/types';

interface TransportSplitterProps {
  onAddExpense: (expense: Expense) => void;
}

const COMMON_ROUTES = [
  { label: 'Westlands / CBD to Flat (Uber/Bolt)', cost: 1200 },
  { label: 'Market Grocery Run (Bodaboda & Porter)', cost: 350 },
  { label: 'Campus Shuttle / Matatu Pooled Fare', cost: 400 },
  { label: 'JKIA Airport Pick-up / Trip', cost: 2500 },
];

export function TransportSplitter({ onAddExpense }: TransportSplitterProps) {
  const { roommates, currentRoommate, showToast } = useHouse();

  const [tripTitle, setTripTitle] = useState(COMMON_ROUTES[0].label);
  const [fareAmount, setFareAmount] = useState<string>(COMMON_ROUTES[0].cost.toString());
  const [payerId, setPayerId] = useState(currentRoommate.id);
  const [passengerIds, setPassengerIds] = useState<string[]>(roommates.map((r) => r.id));

  const togglePassenger = (id: string) => {
    setPassengerIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const cost = parseFloat(fareAmount) || 0;
  const count = passengerIds.length || 1;
  const perPerson = Math.round(cost / count);

  const handleRecordRide = (e: React.FormEvent) => {
    e.preventDefault();
    if (cost <= 0) return;

    const lineItem: LineItem = {
      id: `item_ride_${Date.now()}`,
      name: tripTitle || 'Shared Uber / Matatu Trip',
      cost,
      category: 'cleaning', // lineItem category
      participantIds: passengerIds,
    };

    const newExpense: Expense = {
      id: `exp_ride_${Date.now()}`,
      payerId,
      title: tripTitle || 'Shared Ride / Transport',
      category: 'TRANSPORT',
      totalAmount: cost,
      date: 'Just now',
      mpesaCode: `RIDE${Math.floor(1000 + Math.random() * 9000)}`,
      items: [lineItem],
      verified: true,
    };

    onAddExpense(newExpense);
    showToast(`Recorded shared ride (${formatKES(cost)}) split among ${count} passengers!`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 md:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Shared Fare & Transport Splitter
            </h3>
            <p className="text-xs text-slate-500">
              Split shared Bolt/Uber rides, Matatu stage fares, and campus transport trips
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
          {count} Passengers ({formatKES(perPerson)} each)
        </span>
      </div>

      {/* Preset Route Selectors */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Frequent Flat Trips:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMON_ROUTES.map((route, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTripTitle(route.label);
                setFareAmount(route.cost.toString());
              }}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                tripTitle === route.label
                  ? 'border-purple-400 bg-purple-50/50 font-bold text-purple-900'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <span>{route.label}</span>
              <span className="font-mono text-[11px] text-purple-600 font-extrabold">
                {formatKES(route.cost)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleRecordRide} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Trip Description
            </label>
            <input
              type="text"
              required
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Total Fare (KES)
            </label>
            <input
              type="number"
              required
              value={fareAmount}
              onChange={(e) => setFareAmount(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Paid By
            </label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
            >
              {roommates.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Passenger selector chips */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Who was in the ride? (Select passengers):
          </label>
          <div className="flex flex-wrap gap-2">
            {roommates.map((r) => {
              const isSelected = passengerIds.includes(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => togglePassenger(r.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-purple-50 text-purple-700 border-purple-300'
                      : 'bg-slate-100 text-slate-400 border-transparent line-through'
                  }`}
                >
                  <img src={r.avatar} alt={r.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{r.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Record Ride & Split {formatKES(perPerson)} ea</span>
          </button>
        </div>
      </form>
    </div>
  );
}
