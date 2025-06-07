
import React from 'react';
import { FiCheckCircle, FiDownload } from 'react-icons/fi';

const DownloadInfo = ({ downloadInfo }) => {
  if (!downloadInfo) return null;

  return (
    <div className="alert alert-success mt-4">
      <FiCheckCircle className="h-5 w-5" />
      <div className="flex-1">
        <h3 className="font-semibold">Download Complete</h3>
        <div className="text-sm">Your file is ready to save</div>
        <div className="text-xs mt-1 opacity-80">
          <span className="badge badge-neutral badge-sm mr-1">{downloadInfo.filename?.split('.').pop().toUpperCase()}</span>
          {downloadInfo.fileSize && <span className="badge badge-neutral badge-sm">{downloadInfo.fileSize}</span>}
        </div>
      </div>
      <div className="flex-none">
        <a 
          href={`http://localhost:3000${downloadInfo.downloadUrl}`}
          className="btn btn-sm btn-primary" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FiDownload className="h-4 w-4" />
          Save File
        </a>
      </div>
    </div>
  );
};

export default DownloadInfo;
