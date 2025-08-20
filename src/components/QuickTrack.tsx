'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

interface QuickTrackProps {
  onTrack?: (trackBy: string, searchValue: string) => void;
}

export default function QuickTrack({ onTrack }: QuickTrackProps) {
  const [trackBy, setTrackBy] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [errors, setErrors] = useState<{ trackBy?: string; searchValue?: string }>({});

  const validateForm = () => {
    const newErrors: { trackBy?: string; searchValue?: string } = {};

    if (!trackBy) {
      newErrors.trackBy = 'Please select a tracking method';
    }

    if (!searchValue.trim()) {
      newErrors.searchValue = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTrack = () => {
    if (!validateForm()) {
      return;
    }

    onTrack?.(trackBy, searchValue.trim());
  };

  const handleTrackByChange = (value: string) => {
    setTrackBy(value);
    if (errors.trackBy) {
      setErrors((prev) => ({ ...prev, trackBy: undefined }));
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (errors.searchValue) {
      setErrors((prev) => ({ ...prev, searchValue: undefined }));
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Track</h3>
        <p className="text-gray-900 mb-6">
          Track your order using Order Tracking ID or Client Reference Number
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="block text-sm font-medium text-gray-700">Track By *</div>
            <Select value={trackBy} onValueChange={handleTrackByChange}>
              <SelectTrigger
                className={`w-full ${errors.trackBy ? 'border-red-500 focus:border-red-500' : ''}`}
              >
                <SelectValue placeholder="Select tracking method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order-tracking-id">Order Tracking ID</SelectItem>
                <SelectItem value="client-ref-no">Client Reference Number</SelectItem>
              </SelectContent>
            </Select>
            {errors.trackBy && <p className="text-xs text-red-600 ml-2">{errors.trackBy}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="searchValue" className="block text-sm font-medium text-gray-700">
              {trackBy === 'order-tracking-id'
                ? 'Order Tracking ID'
                : trackBy === 'client-ref-no'
                  ? 'Client Reference Number'
                  : 'Search Value'}{' '}
              *
            </label>
            <Input
              id="searchValue"
              type="text"
              placeholder={
                trackBy === 'order-tracking-id'
                  ? 'Enter Order Tracking ID'
                  : trackBy === 'client-ref-no'
                    ? 'Enter Client Reference Number'
                    : 'Enter search value'
              }
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={errors.searchValue ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.searchValue && (
              <p className="text-xs text-red-600 ml-2">{errors.searchValue}</p>
            )}
          </div>

          <Button
            onClick={handleTrack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            Track Order
          </Button>
        </div>
      </div>
    </div>
  );
}
