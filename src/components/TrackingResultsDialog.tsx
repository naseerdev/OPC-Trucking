import type { TrackingResult } from '@/types/tracking';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

interface TrackingResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trackingResult: TrackingResult | null;
}

export default function TrackingResultsDialog({
  isOpen,
  onClose,
  trackingResult,
}: TrackingResultsDialogProps) {
  if (!trackingResult) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl p-0">
        <DialogTitle className="sr-only">Tracking Results</DialogTitle>
        <DialogDescription className="sr-only">
          Shipment tracking information and details
        </DialogDescription>
        <div className="relative flex size-full flex-col bg-white overflow-x-hidden">
          <div className="flex h-full grow flex-col">
            <div className="px-10 flex flex-1 justify-center py-5">
              <div className="flex flex-col w-full max-w-[960px] py-5 flex-1">
                {/* Header */}
                <h1 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
                  Tracking Results
                </h1>
                <p className="text-[#60758a] text-sm font-normal leading-normal pb-3 pt-1 px-4">
                  {trackingResult?.shipmentInfo && (
                    <>
                      Shipment ID: {trackingResult.shipmentInfo.id} | Shipment Type:{' '}
                      {trackingResult.shipmentInfo.type}
                    </>
                  )}
                  {trackingResult?.totalResults && (
                    <> | Total Results: {trackingResult.totalResults}</>
                  )}
                </p>

                {/* Summary Information */}
                {trackingResult?.summaries && trackingResult.summaries.length > 0 && (
                  <>
                    <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                      Summary Information
                    </h2>
                    <div className="p-4 grid grid-cols-2">
                      {trackingResult.summaries.map((summary, index) => (
                        <div key={index} className="contents">
                          {summary.reference1 && (
                            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
                              <p className="text-[#60758a] text-sm font-normal leading-normal">
                                Reference Number
                              </p>
                              <p className="text-[#111418] text-sm font-normal leading-normal">
                                {summary.reference1}
                              </p>
                            </div>
                          )}
                          {summary.typeDescription && (
                            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
                              <p className="text-[#60758a] text-sm font-normal leading-normal">
                                Shipment Type
                              </p>
                              <p className="text-[#111418] text-sm font-normal leading-normal">
                                {summary.typeDescription}
                              </p>
                            </div>
                          )}
                          {summary.pod && (
                            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
                              <p className="text-[#60758a] text-sm font-normal leading-normal">
                                Proof of Delivery
                              </p>
                              <p className="text-[#111418] text-sm font-normal leading-normal">
                                {summary.pod}
                              </p>
                            </div>
                          )}
                          {summary.parcelCount !== undefined && (
                            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
                              <p className="text-[#60758a] text-sm font-normal leading-normal">
                                Parcel Count
                              </p>
                              <p className="text-[#111418] text-sm font-normal leading-normal">
                                {summary.parcelCount}
                              </p>
                            </div>
                          )}
                          {summary.origin && summary.origin.city && (
                            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
                              <p className="text-[#60758a] text-sm font-normal leading-normal">
                                Origin
                              </p>
                              <p className="text-[#111418] text-sm font-normal leading-normal">
                                {summary.origin.city}, {summary.origin.state}
                              </p>
                            </div>
                          )}
                          {summary.destination && summary.destination.city && (
                            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4">
                              <p className="text-[#60758a] text-sm font-normal leading-normal">
                                Destination
                              </p>
                              <p className="text-[#111418] text-sm font-normal leading-normal">
                                {summary.destination.city}, {summary.destination.state}
                              </p>
                            </div>
                          )}
                          {summary.arrivalTime && (
                            <div className="flex flex-col gap-1 border-b border-t border-solid border-b-[#dbe0e6] py-4 pr-2">
                              <p className="text-[#60758a] text-sm font-normal leading-normal">
                                Arrival Time
                              </p>
                              <p className="text-[#111418] text-sm font-normal leading-normal">
                                {summary.arrivalTime.formattedTime},{' '}
                                {summary.arrivalTime.formattedDate}
                              </p>
                            </div>
                          )}
                          {summary.completedTime && (
                            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4">
                              <p className="text-[#60758a] text-sm font-normal leading-normal">
                                Completed Time
                              </p>
                              <p className="text-[#111418] text-sm font-normal leading-normal">
                                {summary.completedTime.formattedTime},{' '}
                                {summary.completedTime.formattedDate}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {trackingResult?.details && (
                  <>
                    <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                      Detailed Information
                    </h2>
                    <div className="px-4 py-3">
                      {trackingResult.details.parcels &&
                        trackingResult.details.parcels.length > 0 && (
                          <div className="flex overflow-hidden rounded-lg border border-[#dbe0e6] bg-white">
                            <table className="flex-1">
                              <thead>
                                <tr className="bg-white">
                                  <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                                    Barcode
                                  </th>
                                  <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                                    Pieces
                                  </th>
                                  <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                                    Weight
                                  </th>
                                  <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                                    Type
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {trackingResult.details.parcels.map((parcel, index) => (
                                  <tr key={index} className="border-t border-t-[#dbe0e6]">
                                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                                      {parcel.barcode}
                                    </td>
                                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                                      {parcel.pieces}
                                    </td>
                                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                                      {parcel.weight}g
                                    </td>
                                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                                      {parcel.type?.description || 'N/A'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                    </div>
                  </>
                )}

                {/* No Results Message */}
                {trackingResult &&
                  (!trackingResult.summaries || trackingResult.summaries.length === 0) && (
                    <div className="px-4 py-3">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm font-medium">
                          No shipments found matching your search criteria. Please try a different
                          search term.
                        </p>
                      </div>
                    </div>
                  )}

                {/* Error in Details */}
                {trackingResult?.detailsError && (
                  <div className="px-4 py-3">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-orange-800 text-sm font-medium">
                        <strong>Note:</strong> {trackingResult.detailsError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex px-4 py-3 justify-end">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e4e7eb] border-0"
                    >
                      <span className="truncate">Close</span>
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
