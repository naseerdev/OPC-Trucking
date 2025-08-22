'use server';

/* eslint-disable consistent-return */
import type { NextRequest } from 'next/server';

import { EXTERNAL_API_BASE_URL } from '@/utils/constants';
import {
  logError,
  throwTrackingError,
  createTrackingError,
  validateSearchInput,
  createErrorResponse,
  sanitizeErrorMessage,
  createSuccessResponse,
} from '@/lib/utils';

// Constants

async function callExternalTrackingAPI(searchValue: string): Promise<any> {
  const endDate = new Date();
  const beginDate = new Date();
  beginDate.setMonth(beginDate.getMonth() - 2);

  const formattedEndDate = endDate.toISOString().split('T')[0];
  const formattedBeginDate = beginDate.toISOString().split('T')[0];

  const queryParams = new URLSearchParams({
    trackingType: 'TRACKING',
    beginDate: formattedBeginDate,
    endDate: formattedEndDate,
    pageNum: '1',
    pageSize: '12',
  });

  const fullUrl = `${EXTERNAL_API_BASE_URL}/Shipments/Summaries?${queryParams.toString()}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const externalResponse = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        CallingApplication: 'Rapidship',
        'sec-ch-ua-platform': 'Windows',
        Referer: 'https://07650.cxtsoftware.net/rapidship/',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(searchValue),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!externalResponse.ok) {
      const errorMessage = `External API responded with status ${externalResponse.status}`;
      logError('External API Error', {
        status: externalResponse.status,
        statusText: externalResponse.statusText,
      });

      if (externalResponse.status === 404) {
        throwTrackingError(
          'NOT_FOUND',
          'No tracking information found',
          'EXTERNAL_API_404',
          errorMessage
        );
      } else if (externalResponse.status >= 500) {
        throwTrackingError(
          'SERVER',
          'External service temporarily unavailable',
          'EXTERNAL_API_SERVER_ERROR',
          errorMessage
        );
      } else {
        throwTrackingError('API', 'External API error', 'EXTERNAL_API_ERROR', errorMessage);
      }
    }

    const externalData = await externalResponse.json();

    if (!externalData || typeof externalData !== 'object') {
      throwTrackingError(
        'API',
        'Invalid response from external API',
        'EXTERNAL_API_INVALID_RESPONSE',
        'Response is not a valid JSON object'
      );
    }

    return externalData;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throwTrackingError(
        'NETWORK',
        'Request timeout',
        'EXTERNAL_API_TIMEOUT',
        'External API request timed out after 30 seconds'
      );
    }

    if (error.type) {
      throw error;
    }

    // Handle fetch errors
    if (error.message?.includes('fetch')) {
      throwTrackingError(
        'NETWORK',
        'Network error',
        'EXTERNAL_API_NETWORK_ERROR',
        sanitizeErrorMessage(error.message)
      );
    }

    throwTrackingError(
      'UNKNOWN',
      'External API call failed',
      'EXTERNAL_API_UNKNOWN_ERROR',
      sanitizeErrorMessage(error.message)
    );
  }
}

async function getShipmentDetails(shipmentId: string, shipmentType: string): Promise<any> {
  try {
    const detailsUrl = `${EXTERNAL_API_BASE_URL}/Shipments/Details?shipmentType=${shipmentType}&pkId=${shipmentId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const detailsResponse = await fetch(detailsUrl, {
      method: 'GET',
      headers: {
        CallingApplication: 'Rapidship',
        'sec-ch-ua-platform': 'Windows',
        Referer: 'https://07650.cxtsoftware.net/rapidship/',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!detailsResponse.ok) {
      const errorMessage = `Details API responded with status ${detailsResponse.status}`;
      logError('Details API Error', {
        status: detailsResponse.status,
        statusText: detailsResponse.statusText,
      });

      if (detailsResponse.status === 404) {
        throwTrackingError(
          'NOT_FOUND',
          'Shipment details not found',
          'DETAILS_API_404',
          errorMessage
        );
      } else if (detailsResponse.status >= 500) {
        throwTrackingError(
          'SERVER',
          'Details service temporarily unavailable',
          'DETAILS_API_SERVER_ERROR',
          errorMessage
        );
      } else {
        throwTrackingError('API', 'Details API error', 'DETAILS_API_ERROR', errorMessage);
      }
    }

    const detailsData = await detailsResponse.json();

    if (!detailsData || typeof detailsData !== 'object') {
      throwTrackingError(
        'API',
        'Invalid details response',
        'DETAILS_API_INVALID_RESPONSE',
        'Details response is not a valid JSON object'
      );
    }

    return detailsData;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throwTrackingError(
        'NETWORK',
        'Details request timeout',
        'DETAILS_API_TIMEOUT',
        'Details API request timed out after 15 seconds'
      );
    }

    if (error.type) {
      // This is already a TrackingError
      throw error;
    }

    // Handle fetch errors
    if (error.message?.includes('fetch')) {
      throwTrackingError(
        'NETWORK',
        'Details network error',
        'DETAILS_API_NETWORK_ERROR',
        sanitizeErrorMessage(error.message)
      );
    }

    throwTrackingError(
      'UNKNOWN',
      'Details API call failed',
      'DETAILS_API_UNKNOWN_ERROR',
      sanitizeErrorMessage(error.message)
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    let body: any;

    try {
      body = await request.json();
    } catch (parseError) {
      logError('Request Parse Error', parseError, { requestId });
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

    if (!externalData.summaries || externalData.summaries.length === 0) {
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

    const firstShipment = externalData.summaries[0];
    const shipmentId = firstShipment.id;
    const shipmentType = firstShipment.type;

    let detailsData = null;

    try {
      detailsData = await getShipmentDetails(shipmentId, shipmentType);
    } catch (error) {
      logError('Details API Error', error, { requestId, shipmentId, shipmentType });
    }

    const responseData = {
      summaries: externalData.summaries,
      totalResults: externalData.totalResults || externalData.summaries.length,
      details: detailsData,
      shipmentInfo: {
        id: shipmentId,
        type: shipmentType,
      },
      success: true,
      timestamp: new Date().toISOString(),
    };

    return createSuccessResponse(responseData);
  } catch (error: any) {
    const duration = Date.now() - startTime;

    // Log error with context
    logError('Track Order API Error', error, {
      requestId,
      duration: `${duration}ms`,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    });

    if (error.type) {
      return createErrorResponse(error, error.type === 'NOT_FOUND' ? 404 : 500);
    }

    const unexpectedError = createTrackingError(
      'UNKNOWN',
      'An unexpected error occurred',
      'INTERNAL_SERVER_ERROR',
      sanitizeErrorMessage(error.message || 'Unknown error'),
      false
    );

    return createErrorResponse(unexpectedError, 500);
  }
}
