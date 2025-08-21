export interface TrackingResult {
  summaries?: Summary[];
  totalResults?: number;
  details?: ShipmentDetails;
  shipmentInfo?: {
    id: string;
    type: string;
  };
  error?: string;
  detailsError?: string;
}

export interface Summary {
  id: number;
  drivers: any[];
  type: string;
  typeDescription: string;
  status: string | null;
  statusDescription: string | null;
  statusTimestamp: any | null;
  arrivalTime: TimeInfo;
  completedTime: TimeInfo;
  ordered: any | null;
  pickedUp: any | null;
  delivered: any | null;
  pod: string;
  canceledBy: string | null;
  origin: Address;
  destination: Address;
  reference1: string;
  reference2: string | null;
  parcelCount: number;
  exceptions: any[];
  isParent: boolean | null;
  hasAssociatedRouteStops: boolean | null;
  pickupEta: any | null;
  deliverEta: any | null;
  isEditable: boolean;
  isCancelable: boolean;
  pieces: number | null;
  serviceTypeId: any | null;
  driverLocationIsAvailable: boolean;
  showDriverTracking: boolean;
  showStatusBar: boolean;
  showLogIn: boolean;
  originIdIsValid: boolean | null;
  destIdIsValid: boolean | null;
  serviceTypeIdIsValid: boolean | null;
}

export interface Address {
  id: number | null;
  name: string;
  address1: string;
  address2: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  plus4: string;
  validated: number;
  userId: string;
  originComments: string;
  destComments: string;
  lat: number | null;
  lon: number | null;
  phone: string;
  phone2: string | null;
  fax: string | null;
  contact: string | null;
  email: string | null;
  addressBookGroup: string;
  nonUsAddress: number;
  modifiable: boolean;
  barcode: string | null;
  country: string;
  forceLocationScanPickup: string;
  forceLocationScanDelivery: string;
  autoShipTextAlertType: string;
  rowVersion: string | null;
  phoneAsList: string | null;
}

export interface ParcelType {
  id: number;
  description: string;
}

export interface ParcelAssignment {
  address: Address;
  id: number;
  type: string | null;
  creationType: string;
  scannedWhen: string | null;
  scanComment: string | null;
  exceptionDescription: string | null;
  parcelParentId: number;
  items: any[];
}

export interface Parcel {
  id: number;
  type: ParcelType;
  barcode: string;
  pieces: number;
  weight: number;
  description: string;
  assignments: ParcelAssignment[];
  refrigeration: any | null;
  customerMasterParcelId: string | null;
  rowVersion: string;
}

export interface TimeInfo {
  timeStamp: number;
  formattedTime: string;
  formattedDate: string;
  standardizedTime: string;
  standardizedDate: string;
  timeZone: string;
}

export interface ShipmentDetails {
  pod: string;
  podComment: string | null;
  barcode: string | null;
  charges: any | null;
  billingGroup: any | null;
  createdBy: string;
  routeId: string | null;
  signature: string | null;
  pieces: number;
  parcels: Parcel[];
  parcelType: any | null;
  dispatched: any | null;
  ordered: any | null;
  confirmed: any | null;
  atOrigin: any | null;
  atDestination: any | null;
  pickedUp: any | null;
  delivered: any | null;
  arrivalTime: TimeInfo;
  completedTime: TimeInfo;
  weight: any | null;
  sequence: any | null;
  id: number;
  custId: number;
  custName: string | null;
  type: string;
  typeDescription: string;
  statusDescription: string | null;
  statusTimestamp: any | null;
  canceledBy: string | null;
  origin: Address;
  destination: Address;
  reference1: string;
  reference2: string | null;
  exceptions: any[];
  attachmentDetails: any[];
  pickupEta: any | null;
  deliverEta: any | null;
  isEditable: boolean;
  isCancelable: boolean;
  areParcelsEditable: boolean;
  readyTimeFrom: any | null;
  dueTimeTo: any | null;
  numStopsAway: any | null;
  showStatusBar: boolean;
  showDriverTracking: boolean;
  showDriverPhoto: boolean;
  showStatusCodeDescription: boolean;
  showStatusCodeComment: boolean;
  showStatusCodeTime: boolean;
  driverPhotos: any | null;
}
