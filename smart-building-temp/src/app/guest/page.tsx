'use client';

import { useState } from 'react';
import { GuestPortal } from '@/components/guest/GuestPortal';
import { CheckInFlow } from '@/components/checkin/CheckInFlow';

export default function GuestPage() {
  const [mode, setMode] = useState<'checkin' | 'dashboard'>('checkin');

  // Simulate URL parameters or authentication state
  const searchParams = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search) 
    : new URLSearchParams();
  const reservationId = searchParams.get('reservation') || 'RES-2024-001';
  const guestId = searchParams.get('guest') || 'GUEST-123';
  const isReturning = searchParams.get('returning') === 'true';

  return (
    <div className="min-h-screen">
      <GuestPortal
        guestId={guestId}
        reservationId={reservationId}
        mode={isReturning ? 'dashboard' : 'checkin'}
      />
    </div>
  );
}