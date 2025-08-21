'use client';

import type { TrackingResult } from '@/types/tracking';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import TrackingResultsDialog from './TrackingResultsDialog';

const quickTrackSchema = z.object({
  trackBy: z.string().min(1, 'Please select a tracking method'),
  searchValue: z.string().min(1, 'This field is required'),
});

type QuickTrackFormData = z.infer<typeof quickTrackSchema>;

export default function QuickTrack() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<QuickTrackFormData>({
    resolver: zodResolver(quickTrackSchema),
    defaultValues: {
      trackBy: '',
      searchValue: '',
    },
  });

  const trackBy = form.watch('trackBy');

  const onSubmit = async (data: QuickTrackFormData) => {
    setIsLoading(true);
    setApiError(null);
    setTrackingResult(null);

    console.log('Submitting form data:', data);

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackBy: data.trackBy,
          searchValue: data.searchValue.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API response:', result);

      if (result.error) {
        setApiError(result.error);
      } else {
        setTrackingResult(result);
        setIsDialogOpen(true);
      }
    } catch (error: any) {
      console.error('Error tracking order:', error);
      setApiError(error.message || 'An error occurred while tracking your order');
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTrackingResult(null);
  };

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Track</h3>
          <p className="text-[#60758a] mb-6">
            Track your order using Order Tracking ID or Client Reference Number
          </p>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Track</h3>
        <p className="text-gray-900 mb-6">
          Track your order using Order Tracking ID or Client Reference Number
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="trackBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">Track By *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select tracking method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="order-tracking-id">Order Tracking ID</SelectItem>
                      <SelectItem value="client-ref-no">Client Reference Number</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="searchValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {trackBy === 'order-tracking-id'
                      ? 'Order Tracking ID'
                      : trackBy === 'client-ref-no'
                        ? 'Client Reference Number'
                        : 'Search Value'}{' '}
                    *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        trackBy === 'order-tracking-id'
                          ? 'Enter Order Tracking ID'
                          : trackBy === 'client-ref-no'
                            ? 'Enter Client Reference Number'
                            : 'Enter search value'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Tracking...' : 'Track Order'}
            </Button>
          </form>
        </Form>

        {apiError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        <TrackingResultsDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          trackingResult={trackingResult}
        />
      </div>
    </div>
  );
}
