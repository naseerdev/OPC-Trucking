import type { ApiError, ApiResponse, TrackingError, ValidationError } from '@/types/tracking';

import { twMerge } from 'tailwind-merge';
import { NextResponse } from 'next/server';
import { clsx, type ClassValue } from 'clsx';
import { MAX_SEARCH_LENGTH } from '@/utils/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createTrackingError(
  type: TrackingError['type'],
  message: string,
  code: string,
  details?: string,
  retryable: boolean = false
): TrackingError {
  return {
    type,
    message,
    code,
    details,
    retryable,
    timestamp: new Date().toISOString(),
  };
}

export function createApiError(
  message: string,
  code: string,
  statusCode: number,
  details?: string
): ApiError {
  return {
    message,
    code,
    details,
    timestamp: new Date().toISOString(),
    statusCode,
  };
}

export function createValidationError(
  field: string,
  message: string,
  value?: string
): ValidationError {
  return {
    field,
    message,
    value,
  };
}

export function isNetworkError(error: any): boolean {
  return (
    error.name === 'TypeError' ||
    error.message?.includes('fetch') ||
    error.message?.includes('network') ||
    error.message?.includes('Failed to fetch')
  );
}

export function isRetryableError(error: TrackingError): boolean {
  return error.retryable && ['NETWORK', 'SERVER'].includes(error.type);
}

export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
}

export function logError(context: string, error: any, additionalData?: any) {
  const errorData = {
    context,
    timestamp: new Date().toISOString(),
    error: error?.message || error?.toString() || error,
    stack: error?.stack,
    additionalData,
  };

  console.error('Error Log:', errorData);
}

export function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/api[_-]?key[=:]\s*[^\s&]+/gi, 'api_key=***')
    .replace(/password[=:]\s*[^\s&]+/gi, 'password=***')
    .replace(/token[=:]\s*[^\s&]+/gi, 'token=***');
}

export function validateSearchInput(searchValue: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!searchValue || typeof searchValue !== 'string') {
    errors.push('Search value is required and must be a string');
  } else {
    if (searchValue.trim().length === 0) {
      errors.push('Search value cannot be empty');
    }
    if (searchValue.length > MAX_SEARCH_LENGTH) {
      errors.push(`Search value cannot exceed ${MAX_SEARCH_LENGTH} characters`);
    }
    if (!/^[a-zA-Z0-9\s\-_.]+$/.test(searchValue)) {
      errors.push('Search value contains invalid characters');
    }
  }

  return { valid: errors.length === 0, errors };
}

export function createErrorResponse(
  error: TrackingError,
  statusCode: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      message: error.message,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

export function createSuccessResponse(data: any): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: true,
      data,
      message: 'Tracking information retrieved successfully',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export function throwTrackingError(
  type: TrackingError['type'],
  message: string,
  code: string,
  details?: string
): never {
  const trackingError = createTrackingError(type, message, code, details, false);
  const error = new Error(JSON.stringify(trackingError));
  (error as any).trackingError = trackingError;
  throw error;
}
