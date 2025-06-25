'use client';

import { CheckInFlow } from '@/components/checkin/CheckInFlow';
import { useRouter } from 'next/navigation';

export default function CheckInPage() {
  const router = useRouter();

  const handleCheckInComplete = (roomData: any) => {
    // Redirect to guest dashboard after successful check-in
    router.push(`/guest?returning=true&guest=${roomData.guestId}&room=${roomData.roomNumber}`);
  };

  return (
    <div className="min-h-screen">
      <CheckInFlow
        reservationId="RES-2024-001"
        onComplete={handleCheckInComplete}
      />
    </div>
  );
}