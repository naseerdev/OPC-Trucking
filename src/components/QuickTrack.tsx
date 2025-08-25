'use client';

import type { ErrorState } from '@/types/global';
import type { TrackingError, TrackingResult } from '@/types/tracking';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Info, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import TrackingResultsDialog from './TrackingResultsDialog';
import ApiErrorHandler, { type ApiErrorHandlerRef } from './helpers/apiError';

const quickTrackSchema = z.object({
  searchValue: z.string().min(1, 'This field is required'),
});

type QuickTrackFormData = z.infer<typeof quickTrackSchema>;

export default function QuickTrack() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const errorHandlerRef = useRef<ApiErrorHandlerRef>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<QuickTrackFormData>({
    resolver: zodResolver(quickTrackSchema),
    defaultValues: {
      searchValue: '',
    },
  });

  const handleInputChange = useCallback(() => {
    if (errorState) {
      setErrorState(null);
    }
  }, [errorState]);

  const onSubmit = async (data: QuickTrackFormData) => {
    setIsLoading(true);
    setErrorState(null);
    setTrackingResult(null);

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchValue: data.searchValue.trim(),
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setTrackingResult(result.data);
        setIsDialogOpen(true);
        setErrorState(null);
      } else if (result.error) {
        errorHandlerRef.current?.handleApiError(result.error);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      const networkError: TrackingError = {
        type: 'NETWORK',
        message: 'Failed to connect to tracking service',
        code: 'NETWORK_ERROR',
        details: error.message,
        retryable: true,
        timestamp: new Date().toISOString(),
      };
      errorHandlerRef.current?.handleApiError(networkError);
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTrackingResult(null);
  };

  const getErrorIcon = (type: ErrorState['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getErrorStyling = (type: ErrorState['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

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
              name="searchValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Order Tracking ID or Client Reference Number *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Order Tracking ID or Client Reference Number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3">
              <Button
                type="submit"
                className=" bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  'Track Order'
                )}
              </Button>
            </div>
          </form>
        </Form>

        {errorState && (
          <div className={`mt-4 p-4 border rounded-md ${getErrorStyling(errorState.type)}`}>
            <div className="flex items-start space-x-3">
              {getErrorIcon(errorState.type)}
              <div className="flex-1">
                <p className="text-sm font-medium">{errorState.message}</p>
                {errorState.code && (
                  <p className="text-xs mt-1 opacity-75">Error Code: {errorState.code}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setErrorState(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <TrackingResultsDialog
          isOpen={isDialogOpen && !!trackingResult?.totalResults && trackingResult.totalResults > 0}
          onClose={closeDialog}
          trackingResult={trackingResult}
        />

        <ApiErrorHandler ref={errorHandlerRef} onError={setErrorState} />
      </div>
    </div>
  );
}
