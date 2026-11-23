'use client';

import React, { useState } from 'react';
import { ShoppingCart, Plus, Download, Trash2, CheckCircle2, UserCheck } from 'lucide-react';
import { Roommate } from '../lib/types';
import { formatKES } from '../lib/utils';

interface ShoppingItem {
  id: string;
  name: string;
  estimatedPrice: number;
  category: 'greens' | 'meat' | 'dairy' | 'carbs' | 'cleaning';
  consumerIds: string[];
}

interface ShoppingListBuilderProps {
  roommates: Roommate[];
}

export function ShoppingListBuilder({ roommates }: ShoppingListBuilderProps) {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', name: 'Sukuma Wiki (4 Bunches)', estimatedPrice: 120, category: 'greens', consumerIds: roommates.map((r) => r.id) },
    { id: '2', name: 'Managu & Terere', estimatedPrice: 200, category: 'greens', consumerIds: ['roomie_1', 'roomie_2'] },
    { id: '3', name: 'Beef 1/2 Kg', estimatedPrice: 380, category: 'meat', consumerIds: ['roomie_1', 'roomie_2', 'roomie_4'] }, // Dennis excluded
    { id: '4', name: 'Cooking Oil 2L', estimatedPrice: 580, category: 'carbs', consumerIds: roommates.map((r) => r.id) },
    { id: '5', name: 'Dishwashing Paste & Steel Wool', estimatedPrice: 190, category: 'cleaning', consumerIds: roommates.map((r) => r.id) },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ShoppingItem['category']>('greens');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const price = parseFloat(newItemPrice);
    if (isNaN(price) || price <= 0) return;

    // Default consumers: exclude vegetarians if meat
    let consumers = roommates.map((r) => r.id);
    if (newItemCategory === 'meat') {
      consumers = roommates.filter((r) => !r.diet.includes('vegetarian')).map((r) => r.id);
    }

    const item: ShoppingItem = {
      id: `shop_${Date.now()}`,
      name: newItemName,
      estimatedPrice: price,
      category: newItemCategory,
      consumerIds: consumers,
    };

    setItems([...items, item]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleToggleConsumer = (itemId: string, roommateId: string) => {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        const exists = item.consumerIds.includes(roommateId);
        const updated = exists ? item.consumerIds.filter((id) => id !== roommateId) : [...item.consumerIds, roommateId];
        return { ...item, consumerIds: updated };
      })
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter((i) => i.id !== itemId));
  };

  const totalEstimatedCost = items.reduce((acc, curr) => acc + curr.estimatedPrice, 0);

  // Compute breakdown per roommate
  const perRoommateLiability: Record<string, number> = {};
  roommates.forEach((r) => {
    perRoommateLiability[r.id] = 0;
  });

  items.forEach((item) => {
    const count = item.consumerIds.length || 1;
    const split = item.estimatedPrice / count;
    item.consumerIds.forEach((id) => {
      perRoommateLiability[id] = (perRoommateLiability[id] || 0) + split;
    });
  });

  const handleDownloadList = () => {
    let content = `========================================\n`;
    content += `HOUSEMANAGEMENT - MARKET SHOPPING LIST\n`;
    content += `Flat 4B Roysambu · ${new Date().toLocaleDateString()}\n`;
    content += `========================================\n\n`;

    items.forEach((item, idx) => {
      content += `${idx + 1}. [ ] ${item.name} - Ksh ${item.estimatedPrice}\n`;
      content += `   Split among: ${item.consumerIds.length} roommates\n`;
    });

    content += `\n----------------------------------------\n`;
    content += `TOTAL ESTIMATED: Ksh ${totalEstimatedCost}\n`;
    content += `----------------------------------------\n\n`;
    content += `PER-ROOMMATE ESTIMATED SHARE:\n`;

    roommates.forEach((r) => {
      content += `• ${r.name}: Ksh ${Math.round(perRoommateLiability[r.id] || 0)}\n`;
    });

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `market-shopping-list-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-slate-900">Market Shopping List & Dietary Sub-Splitter</h2>
            <span className="px-2 py-0.5 rounded-full bg-electric-50 text-electric-600 text-xs font-bold font-mono">
              Mama Mboga & Supermarket
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build your shopping list before the market trip. Auto-computes who pays for what so vegetarians never fund butchery runs.
          </p>
        </div>

        <button
          onClick={handleDownloadList}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-xs transition-all"
        >
          <Download className="w-4 h-4 text-electric-500" />
          <span>Download Printable List</span>
        </button>
      </div>

      {/* Add New Item Form */}
      <form onSubmit={handleAddItem} className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 border-b border-slate-100">
        <div className="sm:col-span-5">
          <input
            type="text"
            placeholder="Item name (e.g. Sukuma Wiki, Cow Milk 2pkts, Irish Potatoes)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
          />
        </div>

        <div className="sm:col-span-3">
          <input
            type="number"
            placeholder="Est. Price (KES)"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500 font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as any)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
          >
            <option value="greens">Greens / Veggies</option>
            <option value="meat">Meat / Fish</option>
            <option value="dairy">Dairy / Milk</option>
            <option value="carbs">Carbs / Cooking</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full h-full py-2.5 bg-electric-500 hover:bg-electric-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </form>

      {/* Shopping List Table */}
      <div className="pt-4 space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-electric-500" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                <span className="text-[10px] text-slate-400 capitalize">{item.category}</span>
              </div>
            </div>

            {/* Roommate consumer selectors */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-semibold text-slate-400 mr-1">Split:</span>
              {roommates.map((r) => {
                const isIncluded = item.consumerIds.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleToggleConsumer(item.id, r.id)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-all ${
                      isIncluded
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    {r.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            {/* Price & Delete */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
              <span className="font-mono text-xs font-bold text-slate-900">{formatKES(item.estimatedPrice)}</span>
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl">
        <div>
          <span className="text-xs text-slate-500 block">Total Market Trip Estimate</span>
          <span className="font-mono text-xl font-extrabold text-slate-900">{formatKES(totalEstimatedCost)}</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {roommates.map((r) => (
            <div key={r.id} className="text-right">
              <span className="text-[10px] text-slate-400 block">{r.name.split(' ')[0]} owes</span>
              <span className="font-mono text-xs font-bold text-electric-600">
                {formatKES(Math.round(perRoommateLiability[r.id] || 0))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
