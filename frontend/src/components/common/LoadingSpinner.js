import React from 'react';

export default function LoadingSpinner({ fullPage = false, size = 'md' }) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className={`${sizeMap[size]} border-3 border-gray-200 border-t-orange-500 rounded-full animate-spin`}
      style={{ borderWidth: '3px' }}
    />
  );

  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return spinner;
}
