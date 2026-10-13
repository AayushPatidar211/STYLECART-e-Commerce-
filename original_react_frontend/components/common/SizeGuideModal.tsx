import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, categoryName = 'Clothing' }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('women');

  if (!isOpen) return null;

  const womenMeasurements = [
    { size: 'XS', bust: unit === 'in' ? '31 - 32' : '78 - 82', waist: unit === 'in' ? '24 - 25' : '60 - 64', hip: unit === 'in' ? '34 - 35' : '86 - 90' },
    { size: 'S', bust: unit === 'in' ? '33 - 34' : '83 - 88', waist: unit === 'in' ? '26 - 27' : '65 - 70', hip: unit === 'in' ? '36 - 37' : '91 - 95' },
    { size: 'M', bust: unit === 'in' ? '35 - 36' : '89 - 94', waist: unit === 'in' ? '28 - 29' : '71 - 76', hip: unit === 'in' ? '38 - 39' : '96 - 100' },
    { size: 'L', bust: unit === 'in' ? '37 - 39' : '95 - 101', waist: unit === 'in' ? '30 - 32' : '77 - 83', hip: unit === 'in' ? '40 - 42' : '101 - 107' },
    { size: 'XL', bust: unit === 'in' ? '40 - 42' : '102 - 108', waist: unit === 'in' ? '33 - 35' : '84 - 90', hip: unit === 'in' ? '43 - 45' : '108 - 114' },
  ];

  const menMeasurements = [
    { size: 'S', chest: unit === 'in' ? '36 - 38' : '91 - 96', waist: unit === 'in' ? '30 - 31' : '76 - 79', neck: unit === 'in' ? '14.5 - 15' : '37 - 38' },
    { size: 'M', chest: unit === 'in' ? '39 - 41' : '99 - 104', waist: unit === 'in' ? '32 - 34' : '81 - 86', neck: unit === 'in' ? '15.5 - 16' : '39 - 41' },
    { size: 'L', chest: unit === 'in' ? '42 - 44' : '106 - 112', waist: unit === 'in' ? '35 - 37' : '89 - 94', neck: unit === 'in' ? '16.5 - 17' : '42 - 43' },
    { size: 'XL', chest: unit === 'in' ? '45 - 47' : '114 - 120', waist: unit === 'in' ? '38 - 40' : '96 - 102', neck: unit === 'in' ? '17.5 - 18' : '44 - 46' },
    { size: 'XXL', chest: unit === 'in' ? '48 - 50' : '122 - 127', waist: unit === 'in' ? '41 - 43' : '104 - 109', neck: unit === 'in' ? '18.5 - 19' : '47 - 48' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-neutral-800" />
            <h2 className="text-base font-semibold text-neutral-900">Apparel Sizing Chart</h2>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Controls: Gender tabs and Unit toggle */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('women')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'women' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Women's Sizing
              </button>
              <button
                onClick={() => setActiveTab('men')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'men' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Men's Sizing
              </button>
            </div>

            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs font-mono">
              <button
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 rounded transition-colors ${unit === 'in' ? 'bg-white text-neutral-900 shadow-sm font-semibold' : 'text-neutral-600'}`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 rounded transition-colors ${unit === 'cm' ? 'bg-white text-neutral-900 shadow-sm font-semibold' : 'text-neutral-600'}`}
              >
                Centimeters
              </button>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="overflow-x-auto border border-neutral-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 font-mono uppercase text-[11px] border-b border-neutral-200">
                {activeTab === 'women' ? (
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Size</th>
                    <th className="py-2.5 px-4 font-semibold">Bust ({unit})</th>
                    <th className="py-2.5 px-4 font-semibold">Waist ({unit})</th>
                    <th className="py-2.5 px-4 font-semibold">Hips ({unit})</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Size</th>
                    <th className="py-2.5 px-4 font-semibold">Chest ({unit})</th>
                    <th className="py-2.5 px-4 font-semibold">Waist ({unit})</th>
                    <th className="py-2.5 px-4 font-semibold">Neck ({unit})</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {activeTab === 'women'
                  ? womenMeasurements.map((m) => (
                      <tr key={m.size} className="hover:bg-neutral-50/50">
                        <td className="py-2.5 px-4 font-semibold text-neutral-900">{m.size}</td>
                        <td className="py-2.5 px-4 tabular-nums text-neutral-600">{m.bust}</td>
                        <td className="py-2.5 px-4 tabular-nums text-neutral-600">{m.waist}</td>
                        <td className="py-2.5 px-4 tabular-nums text-neutral-600">{m.hip}</td>
                      </tr>
                    ))
                  : menMeasurements.map((m) => (
                      <tr key={m.size} className="hover:bg-neutral-50/50">
                        <td className="py-2.5 px-4 font-semibold text-neutral-900">{m.size}</td>
                        <td className="py-2.5 px-4 tabular-nums text-neutral-600">{m.chest}</td>
                        <td className="py-2.5 px-4 tabular-nums text-neutral-600">{m.waist}</td>
                        <td className="py-2.5 px-4 tabular-nums text-neutral-600">{m.neck}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <div className="bg-neutral-50 p-3 rounded-lg text-xs text-neutral-600 space-y-1">
            <p className="font-semibold text-neutral-900">How to Measure:</p>
            <p><strong>Bust/Chest:</strong> Measure across the fullest part of the chest, keeping the tape horizontal.</p>
            <p><strong>Waist:</strong> Measure around the narrowest natural waistline.</p>
            <p><strong>Hips:</strong> Measure around the fullest part of your hips with feet together.</p>
          </div>
        </div>

        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded hover:bg-neutral-800 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
