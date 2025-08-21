import QuickTrack from '@/components/QuickTrack';

export default function ClientPortalPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Client Portal</h2>
          <p className="text-[#60758a]">
            Track your shipments and manage your logistics with ease. Use the Quick Track tool below
            to find your orders.
          </p>
        </div>
      </div>

      <QuickTrack />
    </div>
  );
}
