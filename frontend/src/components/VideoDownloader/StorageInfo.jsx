import React from 'react';

const StorageInfo = ({ storageInfo, loadingStorage, fetchStorageInfo }) => {
  if (loadingStorage) {
    return (
      <div className="mt-4">
        <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-100 border-2 border-yellow-300 rounded-xl shadow-lg animate-pulse">
          <div className="animate-spin h-5 w-5 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
          <span className="text-sm text-yellow-800 font-semibold">Loading storage info...</span>
        </div>
      </div>
    );
  }

  if (!storageInfo) return null;

  const getProgressColor = (percentage) => {
    if (percentage < 50) return 'bg-gradient-to-r from-emerald-400 via-green-400 to-teal-500';
    if (percentage < 80) return 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500';
    return 'bg-gradient-to-r from-orange-500 via-red-500 to-rose-600';
  };

  const getContainerStyle = (percentage) => {
    if (percentage < 50) return 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-300';
    if (percentage < 80) return 'bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 border-amber-400';
    return 'bg-gradient-to-br from-orange-100 via-red-100 to-rose-100 border-red-400';
  };

  const getIconColor = (percentage) => {
    if (percentage < 50) return 'text-emerald-600';
    if (percentage < 80) return 'text-amber-600';
    return 'text-red-600';
  };

  const getTextColor = (percentage) => {
    if (percentage < 50) return 'text-emerald-800';
    if (percentage < 80) return 'text-amber-800';
    return 'text-red-800';
  };

  const getGlowEffect = (percentage) => {
    if (percentage < 50) return 'shadow-emerald-200';
    if (percentage < 80) return 'shadow-amber-200';
    return 'shadow-red-200';
  };
  return (
    <div className="mt-4 transition-all duration-500 ease-in-out">
      <div className={`${getContainerStyle(storageInfo.usagePercentage)} border-2 rounded-2xl p-5 shadow-2xl ${getGlowEffect(storageInfo.usagePercentage)} hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 backdrop-blur-sm`}>
        <div className="flex flex-col gap-4">
          {/* Header with pulsing animation */}
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${getIconColor(storageInfo.usagePercentage)} bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:rotate-12 hover:scale-110 animate-pulse`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="animate-fadeIn">
                <h3 className={`font-black text-lg sm:text-xl ${getTextColor(storageInfo.usagePercentage)} tracking-wide`}>
                  📁 Server Storage
                </h3>
                <p className={`text-sm opacity-80 ${getTextColor(storageInfo.usagePercentage)} flex items-center gap-1`}>
                  <span className="animate-bounce">📊</span>
                  {storageInfo.fileCount} files stored
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right animate-pulse">
                <div className={`text-xl sm:text-2xl font-black ${getTextColor(storageInfo.usagePercentage)} drop-shadow-sm`}>
                  {storageInfo.usagePercentage}%
                </div>
                <div className={`text-sm opacity-80 ${getTextColor(storageInfo.usagePercentage)} font-semibold`}>
                  {storageInfo.currentSizeMB} / {storageInfo.maxSizeMB} MB
                </div>
              </div>
              
              <button 
                className={`p-3 rounded-full ${getIconColor(storageInfo.usagePercentage)} bg-white hover:bg-yellow-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:rotate-180 hover:scale-110 active:scale-95`}
                onClick={fetchStorageInfo}
                disabled={loadingStorage}
                title="Refresh storage info"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Enhanced Progress Bar with more animations */}
          <div className="relative space-y-2">
            <div className="w-full bg-gradient-to-r from-white to-gray-100 rounded-full h-4 shadow-inner border border-gray-200 overflow-hidden">
              <div 
                className={`h-4 rounded-full ${getProgressColor(storageInfo.usagePercentage)} shadow-xl transition-all duration-1500 ease-out relative overflow-hidden animate-pulse`}
                style={{ width: `${storageInfo.usagePercentage}%` }}
              >
                {/* Multiple animated shine effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 transform -skew-x-12 animate-shimmer"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-20 transform -skew-x-12 animate-pulse delay-300"></div>
                {/* Floating sparkles */}
                <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-ping delay-100"></div>
                <div className="absolute top-1 right-1/3 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
              </div>
            </div>
            
            {/* Floating percentage badge with enhanced styling */}
            <div 
              className={`absolute -top-10 transition-all duration-1500 ease-out transform hover:scale-110`}
              style={{ left: `${Math.max(10, Math.min(85, storageInfo.usagePercentage))}%`, transform: 'translateX(-50%)' }}
            >
              <div className={`px-3 py-2 rounded-full text-sm font-black text-white shadow-2xl ${getProgressColor(storageInfo.usagePercentage)} border-2 border-white animate-bounce backdrop-blur-sm`}>
                🚀 {storageInfo.usagePercentage}%
              </div>
            </div>
          </div>          
          {/* Enhanced Warning or Status with more visual appeal */}
          {storageInfo.usagePercentage > 90 ? (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 border-2 border-red-400 rounded-xl animate-bounce shadow-lg">
              <div className="p-2 bg-red-500 rounded-full animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <span className="text-red-800 font-bold text-sm sm:text-base flex items-center gap-2">
                🚨 Storage almost full! Old files will be auto-deleted
              </span>
            </div>
          ) : storageInfo.usagePercentage > 70 ? (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-100 border-2 border-amber-400 rounded-xl shadow-lg animate-pulse">
              <div className="p-2 bg-amber-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-amber-800 font-semibold text-sm sm:text-base flex items-center gap-2">
                ⚠️ Storage getting full
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 border-2 border-emerald-400 rounded-xl shadow-lg">
              <div className="p-2 bg-emerald-500 rounded-full animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-emerald-800 font-semibold text-sm sm:text-base flex items-center gap-2">
                ✅ Storage healthy & optimal
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageInfo;
