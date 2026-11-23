'use client';

import React from 'react';
import { ShoppingListBuilder } from '../../components/ShoppingListBuilder';
import { useHouse } from '../../context/HouseContext';

export default function ShoppingPage() {
  const { roommates } = useHouse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Market Shopping List & Dietary Sub-Splitter
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Plan Mama Mboga and supermarket runs. Toggle participants per item so vegetarians never fund the butchery and export a printable list.
        </p>
      </div>

      <ShoppingListBuilder roommates={roommates} />
    </div>
  );
}
