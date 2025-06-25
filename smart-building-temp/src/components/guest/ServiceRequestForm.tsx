'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { useMutation } from '@tanstack/react-query';

const requestSchema = z.object({
  type: z.string().min(1, 'Select a service type'),
  description: z.string().min(1, 'Provide a description'),
});

type FormData = z.infer<typeof requestSchema>;

interface ServiceRequestFormProps {
  onSuccess?: () => void;
}

export function ServiceRequestForm({ onSuccess }: ServiceRequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(requestSchema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      apiClient.createServiceRequest({
        type: data.type as any,
        description: data.description,
        priority: 'normal',
        guestId: '',
      }),
    onSuccess: () => {
      reset();
      onSuccess?.();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Service Type</label>
        <select
          {...register('type')}
          className="w-full border rounded-lg p-2"
          defaultValue=""
        >
          <option value="" disabled>
            Select service
          </option>
          <option value="room-service">Room Service</option>
          <option value="housekeeping">Housekeeping</option>
          <option value="maintenance">Maintenance</option>
          <option value="concierge">Concierge</option>
        </select>
        {errors.type && (
          <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register('description')}
          className="w-full border rounded-lg p-2"
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
      <Button type="submit" loading={mutation.isPending}>
        Submit Request
      </Button>
    </form>
  );
}
