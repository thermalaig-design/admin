import React from 'react';
import SponsorSection from '../../components/SponsorSection';

const SponsorsPage = () => {
  return (
    <div className="flex-1 pb-10">
      {/* Page Header */}
      <div className="px-6 py-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-800">Sponsor Management</h1>
        <p className="text-gray-600 mt-1">Manage sponsor information and details</p>
      </div>
      
      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <SponsorSection />
        </div>
      </div>
    </div>
  );
};

export default SponsorsPage;