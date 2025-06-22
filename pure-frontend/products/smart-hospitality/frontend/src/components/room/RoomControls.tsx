'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Device } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@radix-ui/react-slider';

interface RoomControlsProps {
  roomId: string;
}

export function RoomControls({ roomId }: RoomControlsProps) {
  const { data } = useQuery({
    queryKey: ['room-devices', roomId],
    queryFn: () => apiClient.getRoomDevices(roomId),
  });

  const devices = data?.data || [];

  const mutation = useMutation({
    mutationFn: (cmd: { deviceId: string; action: any }) =>
      apiClient.controlDevice({
        roomId,
        deviceId: cmd.deviceId,
        action: cmd.action,
      }),
  });

  const handleTempChange = (device: Device, value: number[]) => {
    mutation.mutate({ deviceId: device.id, action: { temperature: value[0] } });
  };

  const handleBrightnessChange = (device: Device, value: number[]) => {
    mutation.mutate({ deviceId: device.id, action: { brightness: value[0] } });
  };

  return (
    <div className="space-y-4">
      {devices.map((device) => (
        <div key={device.id} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 capitalize">
              {device.name}
            </h3>
            <span className="text-sm text-gray-500">{device.type}</span>
          </div>
          {device.type === 'air_conditioner' && (
            <Slider
              className="w-full"
              defaultValue={[device.currentState?.temperature || 22]}
              min={16}
              max={30}
              step={1}
              onValueCommit={(v) => handleTempChange(device, v)}
            />
          )}
          {device.type === 'lighting' && (
            <Slider
              className="w-full"
              defaultValue={[device.currentState?.brightness || 70]}
              min={0}
              max={100}
              step={5}
              onValueCommit={(v) => handleBrightnessChange(device, v)}
            />
          )}
          {device.type === 'tv' && (
            <Button
              size="sm"
              onClick={() =>
                mutation.mutate({ deviceId: device.id, action: { power: true } })
              }
            >
              Power On
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
