
import React from 'react';
import { API_BASE_URL } from '../../utils/apiConfig';
import { FiCheckCircle, FiDownload } from 'react-icons/fi';

const DownloadInfo = ({ downloadInfo }) => {
  if (!downloadInfo) return null;

  // Function to force download instead of opening in browser
  const handleDownload = (downloadUrl, filename) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}${downloadUrl}`;
    link.download = filename || 'download'; // Force download attribute
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle multiple file downloads
  const handleMultipleDownloads = () => {
    if (downloadInfo.downloadedFiles && downloadInfo.downloadedFiles.length > 0) {
      // Download each file with a small delay to prevent browser blocking
      downloadInfo.downloadedFiles.forEach((file, index) => {
        setTimeout(() => {
          handleDownload(file.downloadUrl, file.filename);
        }, index * 500); // 500ms delay between downloads
      });
    } else if (downloadInfo.downloadUrl) {
      // Single file download
      handleDownload(downloadInfo.downloadUrl, downloadInfo.filename);
    }
  };

  return (
    <div className="alert alert-success mt-4">
      <FiCheckCircle className="h-5 w-5" />
      <div className="flex-1">
        <h3 className="font-semibold">Download Complete</h3>
        <div className="text-sm">
          {downloadInfo.multipleFiles ? 
            `${downloadInfo.downloadedFiles?.length || 0} files are ready to save` :
            'Your file is ready to save'
          }
        </div>
        <div className="text-xs mt-1 opacity-80">
          {downloadInfo.multipleFiles ? (
            <div className="flex flex-wrap gap-1">
              <span className="badge badge-neutral badge-sm">Multiple Files</span>
              {downloadInfo.fileSize && <span className="badge badge-neutral badge-sm">{downloadInfo.fileSize}</span>}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              <span className="badge badge-neutral badge-sm mr-1">{downloadInfo.filename?.split('.').pop().toUpperCase()}</span>
              {downloadInfo.fileSize && <span className="badge badge-neutral badge-sm">{downloadInfo.fileSize}</span>}
            </div>
          )}
        </div>
      </div>
      <div className="flex-none">
        <button 
          onClick={handleMultipleDownloads}
          className="btn btn-sm btn-primary"
        >
          <FiDownload className="h-4 w-4" />
          {downloadInfo.multipleFiles ? 'Download All' : 'Save File'}
        </button>
      </div>
    </div>
  );
};

export default DownloadInfo;
