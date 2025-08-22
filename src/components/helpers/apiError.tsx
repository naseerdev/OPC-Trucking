'use client';

import type { TrackingError } from '@/types/tracking';

import { forwardRef, useCallback, useImperativeHandle } from 'react';

interface ApiErrorHandlerProps {
  onError: (errorState: {
    message: string;
    type: 'error' | 'warning' | 'info';
    code?: string;
    retryable?: boolean;
    timestamp: string;
  }) => void;
}

export interface ApiErrorHandlerRef {
  handleApiError: (error: TrackingError) => void;
}

const ApiErrorHandler = forwardRef<ApiErrorHandlerRef, ApiErrorHandlerProps>(({ onError }, ref) => {
  const handleApiError = useCallback(
    (error: TrackingError) => {
      const isRetryable = error.retryable;

      let errorMessage = error.message;
      let errorType: 'error' | 'warning' | 'info' = 'error';

      switch (error.type) {
        case 'NOT_FOUND':
          errorMessage =
            'No tracking information found for your request. Please check your tracking number and try again.';
          errorType = 'warning';
          break;
        case 'VALIDATION':
          errorMessage = 'Please check your input and try again.';
          errorType = 'warning';
          break;
        case 'API':
          if (error.code === 'RATE_LIMIT_EXCEEDED') {
            errorMessage = 'Too many requests. Please wait a moment before trying again.';
            errorType = 'warning';
          } else {
            errorMessage =
              'Unable to retrieve tracking information at this time. Please try again later.';
            errorType = 'error';
          }
          break;
        case 'NETWORK':
          errorMessage =
            'Network connection issue. Please check your internet connection and try again.';
          errorType = 'error';
          break;
        case 'SERVER':
          errorMessage = 'Service temporarily unavailable. Please try again in a few moments.';
          errorType = 'warning';
          break;
        default:
          errorMessage = error.message || 'An unexpected error occurred. Please try again.';
          errorType = 'error';
      }

      onError({
        message: errorMessage,
        type: errorType,
        code: error.code,
        retryable: isRetryable,
        timestamp: new Date().toISOString(),
      });
    },
    [onError]
  );

  useImperativeHandle(ref, () => ({
    handleApiError,
  }));

  return null;
});

ApiErrorHandler.displayName = 'ApiErrorHandler';

export default ApiErrorHandler;
