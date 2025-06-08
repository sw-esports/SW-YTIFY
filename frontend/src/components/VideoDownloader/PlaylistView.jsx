import React from 'react';
import { FiRefreshCw, FiCheckSquare, FiSquare, FiDownload } from 'react-icons/fi';
import PlaylistItem from './PlaylistItem';
import { API_BASE_URL } from '../../utils/apiConfig';

const PlaylistView = ({ 
  playlistInfo, 
  loadingPlaylist,
  loading,
  progress,
  downloadInfo,
  selectedVideos,
  toggleVideoSelection,
  selectAllVideos,
  deselectAllVideos,
  handleDownloadVideo,
  handleDownloadSelectedVideos,
  resetDownloadState
}) => {
  if (!playlistInfo) return null;  // Track whether we're in download or save mode
  const isDownloadComplete = downloadInfo && progress === 100 && !loading;
    return (    <div className="mt-4 bg-base-300 rounded-lg p-4 sm:p-6 border border-base-300">
      {loadingPlaylist ? (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold break-words" title={playlistInfo.title}>
                  {playlistInfo.title.length > 50 ? `${playlistInfo.title.substring(0, 50)}...` : playlistInfo.title}
                </h3>
                <p className="text-sm opacity-80">{playlistInfo.videoCount} videos in playlist</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                {isDownloadComplete && (
                  <button 
                    className="btn btn-sm btn-outline btn-warning flex-shrink-0" 
                    onClick={() => {
                      resetDownloadState();
                      deselectAllVideos();
                    }}
                    disabled={loading}
                  >
                    <FiRefreshCw className="h-4 w-4" />
                    Clear & New Selection
                  </button>
                )}                <button 
                  className="btn btn-sm btn-outline flex-shrink-0"
                  onClick={selectAllVideos}
                  disabled={loading}
                >
                  <FiCheckSquare className="h-4 w-4" />
                  Select All
                </button>
                <button 
                  className="btn btn-sm btn-outline" 
                  onClick={deselectAllVideos}
                  disabled={loading}
                >
                  <FiSquare className="h-4 w-4" />
                  Deselect All
                </button>
              </div>
            </div>{selectedVideos.length > 0 && (
              <div className="bg-base-100 p-2 rounded-lg flex justify-between items-center">
                <span className="text-sm">{selectedVideos.length} videos selected</span>
                {!isDownloadComplete ? (                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={handleDownloadSelectedVideos}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        <FiDownload className="h-4 w-4" />
                        Download Selected
                      </>
                    )}
                  </button>
                ) : (
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => {
                      // Save all files at once
                      if (downloadInfo.multipleFiles && downloadInfo.downloadedFiles) {                        downloadInfo.downloadedFiles.forEach((file, index) => {
                          setTimeout(() => {
                            const link = document.createElement('a');
                            link.href = `${API_BASE_URL}${file.downloadUrl}`;
                            link.download = file.filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }, index * 100);
                        });
                      } else {
                        const link = document.createElement('a');
                        link.href = `${API_BASE_URL}${downloadInfo.downloadUrl}`;
                        link.download = downloadInfo.filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }}
                  >
                    <FiDownload className="h-4 w-4" />
                    Save All ({downloadInfo.multipleFiles ? downloadInfo.downloadedFiles?.length || 0 : 1})
                  </button>
                )}
              </div>
            )}
          </div>            <div className="flex flex-col w-full gap-3 max-h-[400px] overflow-y-auto">            {playlistInfo.videos.map(video => (
              <PlaylistItem
                key={video.id}
                video={video}
                selectedVideos={selectedVideos}
                toggleVideoSelection={toggleVideoSelection}
                loading={loading}
                handleDownloadVideo={handleDownloadVideo}
                downloadInfo={downloadInfo}
              />            ))}
          </div>
            {/* Progress Bar at bottom if loading */}
          {loading && (
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Downloading...</span>
                <span className="text-sm font-bold">{Math.round(progress)}%</span>
              </div>
              <progress className="progress progress-success w-full" value={progress} max="100"></progress>
            </div>
          )}          {/* Bottom Download/Save Button */}
          {selectedVideos.length > 0 && (
            <div className="mt-4">
              {!isDownloadComplete ? (
                // Show Download Button when not yet downloaded
                <button 
                  className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
                  onClick={handleDownloadSelectedVideos}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : 'Download Selected Videos'}
                </button>
              ) : (
                // Show Save All Button after download is complete
                <div className="w-full space-y-3">
                  <div className="alert alert-success">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{downloadInfo.filename}</span>
                  </div>
                  
                  <button 
                    className="btn btn-success w-full"                    onClick={() => {
                      // Save all files at once by triggering downloads
                      if (downloadInfo.multipleFiles && downloadInfo.downloadedFiles) {
                        downloadInfo.downloadedFiles.forEach((file, index) => {
                          setTimeout(() => {
                            const link = document.createElement('a');
                            link.href = `${API_BASE_URL}${file.downloadUrl}`;
                            link.download = file.filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }, index * 100); // Small delay between downloads
                        });
                      } else {
                        // Single file download
                        const link = document.createElement('a');
                        link.href = `${API_BASE_URL}${downloadInfo.downloadUrl}`;
                        link.download = downloadInfo.filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {downloadInfo.multipleFiles ? `Save All Files (${downloadInfo.downloadedFiles?.length || 0})` : 'Save File'}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlaylistView;
