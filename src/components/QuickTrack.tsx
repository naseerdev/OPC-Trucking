'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

const quickTrackSchema = z.object({
  trackBy: z.string().min(1, 'Please select a tracking method'),
  searchValue: z.string().min(1, 'This field is required'),
});

type QuickTrackFormData = z.infer<typeof quickTrackSchema>;

export default function QuickTrack() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

      // TODO: Handle the response data here
      // You can add state to display results, show success/error messages, etc.
    } catch (error: any) {
      console.error('Error tracking order:', error);
      // TODO: Handle errors - show user-friendly error messages
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* 
        {apiError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )} */}

        {/* Results Display */}
        {/* {results.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Tracking Results</h4>
            <div className="space-y-3">
              {results.map((shipment) => (
                <div key={shipment.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {trackBy === 'order-tracking-id'
                          ? `Tracking ID: ${shipment.trackingNumber || 'N/A'}`
                          : `Reference: ${shipment.clientReferenceNumber || 'N/A'}`}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Status: {shipment.status || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* {results?.length === 0 && !isLoading && form.watch('searchValue')?.trim() && trackBy && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-600">
              No shipments found matching your search criteria. Please try a different search term.
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}
