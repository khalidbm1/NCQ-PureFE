'use client';

import { useState } from 'react';
import { X, Info } from 'lucide-react';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
                    typeof window !== 'undefined' && window.location.search.includes('demo=true');

  if (!isDemoMode || !isVisible) return null;

  return (
    <div className="bg-blue-600 text-white px-4 py-2 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          <p className="text-sm font-medium">
            Demo Mode: You're viewing the Smart Building system with mock data
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-blue-700 rounded transition-colors"
          aria-label="Close demo banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}