'use server';

import type { NextRequest } from 'next/server';
import type { DetailsResponse, SummariesResponse } from '@/types/global';

import { COMMON_HEADERS, EXTERNAL_API_BASE_URL } from '@/utils/constants';
import {
  logError,
  throwTrackingError,
  createTrackingError,
  validateSearchInput,
  createErrorResponse,
  sanitizeErrorMessage,
  createSuccessResponse,
} from '@/lib/utils';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

async function fetchWithTimeout<T>(
  url: string,
  options: RequestInit,
  timeoutMs = 15000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }
    return (await response.json()) as T;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throwTrackingError(
        'NETWORK',
        'Request timeout',
        'FETCH_TIMEOUT',
        `Request timed out after ${timeoutMs}ms`
      );
    } else {
      throwTrackingError(
        'NETWORK',
        'Fetch failed',
        'FETCH_ERROR',
        sanitizeErrorMessage(err.message)
      );
    }
  } finally {
    clearTimeout(timeoutId);
  }

  throw new Error('Unreachable code');
}

// -------------------- API Calls --------------------
async function callExternalTrackingAPI(searchValue: string): Promise<SummariesResponse> {
  const endDate = new Date();
  const beginDate = new Date();
  beginDate.setMonth(beginDate.getMonth() - 2);

  const queryParams = new URLSearchParams({
    trackingType: 'TRACKING',
    beginDate: formatDate(beginDate),
    endDate: formatDate(endDate),
    pageNum: '1',
    pageSize: '12',
  });

  const url = `${EXTERNAL_API_BASE_URL}/Shipments/Summaries?${queryParams}`;

  return fetchWithTimeout<SummariesResponse>(
    url,
    { method: 'POST', headers: COMMON_HEADERS, body: JSON.stringify(searchValue) },
    30000
  );
}

async function getShipmentDetails(
  shipmentId: string,
  shipmentType: string
): Promise<DetailsResponse> {
  const url = `${EXTERNAL_API_BASE_URL}/Shipments/Details?shipmentType=${shipmentType}&pkId=${shipmentId}`;

  return fetchWithTimeout<DetailsResponse>(url, { method: 'GET', headers: COMMON_HEADERS }, 15000);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).substring(7);

  try {
    let body: { searchValue: string };

    try {
      body = await request.json();
    } catch {
      return createErrorResponse(
        createTrackingError(
          'VALIDATION',
          'Invalid JSON in request body',
          'INVALID_JSON',
          'Request body must be valid JSON',
          false
        ),
        400
      );
    }

    const { searchValue } = body;

    const validation = validateSearchInput(searchValue);

    if (!validation.valid) {
      return createErrorResponse(
        createTrackingError(
          'VALIDATION',
          'Invalid search input',
          'INVALID_INPUT',
          validation.errors.join('; '),
          false
        ),
        400
      );
    }

    const externalData = await callExternalTrackingAPI(searchValue);

    if (!externalData?.summaries?.length) {
      return createErrorResponse(
        createTrackingError(
          'NOT_FOUND',
          'No tracking information found',
          'NO_RESULTS',
          `No shipments found for: ${searchValue}`,
          false
        ),
        404
      );
    }

    const { id: shipmentId, type: shipmentType } = externalData.summaries[0];

    let detailsData: DetailsResponse | null = null;

    try {
      detailsData = await getShipmentDetails(shipmentId, shipmentType);
    } catch (error) {
      logError('Details API Error', error, { requestId, shipmentId, shipmentType });
    }

    return createSuccessResponse({
      summaries: externalData.summaries,
      totalResults: externalData.totalResults ?? externalData.summaries.length,
      details: detailsData,
      shipmentInfo: { id: shipmentId, type: shipmentType },
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;

    logError('Track Order API Error', error, {
      requestId,
      duration: `${duration}ms`,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    });

    if (error.type) {
      return createErrorResponse(error, error.type === 'NOT_FOUND' ? 404 : 500);
    }

    return createErrorResponse(
      createTrackingError(
        'UNKNOWN',
        'An unexpected error occurred',
        'INTERNAL_SERVER_ERROR',
        sanitizeErrorMessage(error.message || 'Unknown error'),
        false
      ),
      500
    );
  }
}
