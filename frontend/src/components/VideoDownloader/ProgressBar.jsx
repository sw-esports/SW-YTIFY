import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm">Downloading...</span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
    </div>
  );
};

export default ProgressBar;
