import React from 'react';

const DownloadStatus = ({ loading, progress, error, downloadInfo }) => {
  return (
    <>
      {loading && (
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Downloading...</span>
            <span className="text-sm font-bold">{Math.round(progress)}%</span>
          </div>
          <progress className="progress progress-success w-full" value={progress} max="100"></progress>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error mt-4 shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Download Failed!</h3>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}
      
      {downloadInfo && (
        <div className="alert alert-success mt-4 shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Download Complete!</h3>
              <div className="text-sm">Your file is ready to save</div>
              <div className="text-xs mt-1 opacity-80">
                <span className="badge badge-neutral badge-sm mr-1">{downloadInfo.filename?.split('.').pop().toUpperCase()}</span>
                {downloadInfo.fileSize && <span className="badge badge-neutral badge-sm">{downloadInfo.fileSize}</span>}
              </div>
            </div>
          </div>
          <div className="flex-none">
            <a 
              href={`http://localhost:3000${downloadInfo.downloadUrl}`}
              className="btn btn-sm btn-success text-white" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Save File
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadStatus;
