import React from 'react';
import { FiDownload, FiSearch, FiAlertCircle } from 'react-icons/fi';

const UrlInput = ({ 
  url, 
  setUrl, 
  isValidUrl, 
  handleDownload, 
  loading,
  isPlaylist
}) =>{  return (
    <>
      <div className="join w-full mb-4">
        <input
          type="text"
          className={`input input-bordered input-primary join-item flex-1 ${!isValidUrl && url.length > 0 ? 'input-error' : ''}`}
          placeholder="Enter YouTube URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button 
          className={`btn btn-primary join-item ${loading ? 'loading' : ''}`}
          onClick={handleDownload}
          disabled={loading || (!isValidUrl && url.length > 0)}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : isPlaylist ? (
            <>
              <FiSearch className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Search</span>
            </>
          ) : (
            <>
              <FiDownload className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Download</span>
            </>
          )}
        </button>
      </div>
      
      {!isValidUrl && url.length > 0 && (
        <div className="alert alert-error mb-4">
          <FiAlertCircle className="h-5 w-5" />
          <span>Please enter a valid YouTube URL</span>
        </div>
      )}
    </>
  );
};

export default UrlInput;
