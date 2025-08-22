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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl p-0">
        <DialogTitle className="sr-only">Tracking Results</DialogTitle>

        <DialogDescription className="sr-only">
          Essential shipment tracking information
        </DialogDescription>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Tracking Information</h2>
          </div>

          {trackingResult?.summaries && trackingResult.summaries.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              {trackingResult.summaries
                .filter((summary) => summary.typeDescription === 'Delivery')
                .map((summary, index) => (
                  <div key={index} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                      {summary.id && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">ID:</p>
                          <p className="font-semibold text-gray-800">{summary.id}</p>
                        </div>
                      )}

                      {summary.reference1 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Reference:</p>
                          <p className="font-semibold text-gray-800">{summary.reference1}</p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                      {summary.typeDescription && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Stop Type:</p>
                          <p className="font-semibold text-gray-800">{summary.typeDescription}</p>
                        </div>
                      )}

                      {summary.arrivalTime && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date:</p>
                          <p className="font-semibold text-gray-800">
                            {summary.arrivalTime.formattedDate}
                          </p>
                        </div>
                      )}

                      {summary.arrivalTime && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Time:</p>
                          <p className="font-semibold text-gray-800">
                            {summary.arrivalTime.formattedTime}{' '}
                            {summary.arrivalTime.timeZone && `(${summary.arrivalTime.timeZone})`}
                          </p>
                        </div>
                      )}

                      {summary.destination && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Address:</p>
                          <p className="font-semibold text-gray-800">
                            {summary.destination.city}, {summary.destination.state}{' '}
                            {summary.destination.zip}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 my-4" />

                    {/* Third Section: Assigned By, Proof of Delivery, Barcode */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                      {trackingResult?.details?.createdBy && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Assigned By:</p>
                          <p className="font-semibold text-gray-800">
                            {trackingResult.details.createdBy}
                          </p>
                        </div>
                      )}

                      {trackingResult?.details?.pod && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Proof of Delivery:</p>
                          <p className="font-semibold text-gray-800">
                            {trackingResult.details.pod}
                          </p>
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Barcode Number:</p>
                        <p className="font-semibold text-gray-800">
                          {trackingResult?.details?.barcode ||
                            (trackingResult?.details?.parcels &&
                            trackingResult.details.parcels.length > 0
                              ? trackingResult.details.parcels[0]?.barcode || 'N/A'
                              : 'N/A')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {trackingResult &&
            (!trackingResult.summaries || trackingResult.summaries.length === 0) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm font-medium">
                  No shipments found matching your search criteria. Please try a different search
                  term.
                </p>
              </div>
            )}

          {trackingResult?.detailsError && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
              <p className="text-orange-800 text-sm font-medium">
                <strong>Note:</strong> {trackingResult.detailsError}
              </p>
            </div>
          )}

          <div className="flex justify-end mt-8">
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose} className="cursor-pointer">
                Close
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
