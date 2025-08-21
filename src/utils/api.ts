import axios from 'axios';

import { endpoints } from './endpoints';

// Create axios instance with default config
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});

// API response interface
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

// Shipment tracking interface
export interface ShipmentTrackingParams {
  trackingType: string;
  beginDate: string;
  endDate: string;
  pageNum: number;
  pageSize: number;
}

// Shipment summary interface
export interface ShipmentSummary {
  id: string;
  trackingNumber?: string;
  clientReferenceNumber?: string;
  status?: string;
  // Add more fields as needed based on the actual API response
}

// Shipment tracking API call
export const trackShipments = async (
  params: ShipmentTrackingParams
): Promise<ApiResponse<ShipmentSummary[]>> => {
  try {
    const response = await api.post(endpoints.shipments.summaries, params);

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to track shipments');
  }
};

// Quick track function for individual orders
export const quickTrackOrder = async (
  trackBy: string,
  searchValue: string
): Promise<ApiResponse<ShipmentSummary[]>> => {
  try {
    // For quick tracking, we'll use a smaller date range and search by the provided value
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const params: ShipmentTrackingParams = {
      trackingType: 'TRACKING',
      beginDate: thirtyDaysAgo.toISOString().split('T')[0], // Format: YYYY-MM-DD
      endDate: today.toISOString().split('T')[0], // Format: YYYY-MM-DD
      pageNum: 1,
      pageSize: 50, // Larger page size for quick search
    };

    console.log('Making API request to:', endpoints.shipments.summaries);
    console.log('Request payload:', params);

    let response;

    try {
      // Try POST first (WCF services typically expect POST)
      response = await api.post(endpoints.shipments.summaries, params);
      console.log('POST request successful:', response);
    } catch (postError: any) {
      console.log('POST request failed, trying GET with query parameters:', postError.message);

      // Fallback to GET with query parameters
      response = await api.get(endpoints.shipments.summaries, { params });
      console.log('GET request successful:', response);
    }

    // Filter results based on trackBy and searchValue
    let filteredData = response.data;

    if (trackBy === 'order-tracking-id') {
      filteredData = response.data.filter((shipment: any) =>
        shipment.trackingNumber?.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else if (trackBy === 'client-ref-no') {
      filteredData = response.data.filter((shipment: any) =>
        shipment.clientReferenceNumber?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return {
      data: filteredData,
      status: response.status,
    };
  } catch (error: any) {
    console.error('API error details:', error);
    console.error('Error response:', error.response);
    throw new Error(error.response?.data?.message || error.message || 'Failed to track order');
  }
};

export default api;
