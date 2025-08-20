'use client';

import QuickTrack from '@/components/QuickTrack';

export default function ClientPortalPage() {
  const handleTrack = (trackBy: string, searchValue: string) => {
    console.log('Tracking:', { trackBy, searchValue });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}

      <QuickTrack onTrack={handleTrack} />
    </div>
  );
}
