'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID required'),
  lastName: z.string().min(1, 'Last name required'),
});

type FormData = z.infer<typeof formSchema>;

export default function CheckInPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      await apiClient.checkIn({ bookingId: data.bookingId });
      router.push('/');
    } catch (e: any) {
      setError('Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Online Check-In</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Booking ID</label>
            <input
              {...register('bookingId')}
              className="w-full border rounded-lg p-2"
            />
            {errors.bookingId && (
              <p className="text-sm text-red-600 mt-1">
                {errors.bookingId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              {...register('lastName')}
              className="w-full border rounded-lg p-2"
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Complete Check-In
          </Button>
        </form>
      </div>
    </div>
  );
}
