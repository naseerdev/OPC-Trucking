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
}
