import React from 'react';

const PlaylistView = ({ 
  playlistInfo, 
  loading, 
  loadingPlaylist,
  selectedVideos,
  toggleVideoSelection,
  selectAllVideos,
  deselectAllVideos,
  handleDownloadVideo,
  handleDownloadSelectedVideos
}) => {
  if (!playlistInfo) return null;
  
  return (
    <div className="mt-4 bg-base-200 rounded-box p-4">
      {loadingPlaylist ? (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between items-center">
              <div className="max-w-[70%]">
                <h3 className="text-lg font-bold truncate">{playlistInfo.title}</h3>
                <p className="text-sm">{playlistInfo.videoCount} videos in playlist</p>
              </div>
              <div className="flex gap-2">
                <button 
                  className="btn btn-sm btn-outline" 
                  onClick={selectAllVideos}
                  disabled={loading}
                >
                  Select All
                </button>
                <button 
                  className="btn btn-sm btn-outline" 
                  onClick={deselectAllVideos}
                  disabled={loading}
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            {selectedVideos.length > 0 && (
              <div className="bg-base-100 p-2 rounded-lg flex justify-between items-center">
                <span className="text-sm">{selectedVideos.length} videos selected</span>
                <button 
                  className="btn btn-sm btn-success text-white"
                  onClick={handleDownloadSelectedVideos}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : "Download Selected"}
                </button>
              </div>
            )}
          </div>
          
          <div className="grid gap-3 max-h-[400px] overflow-y-auto">
            {playlistInfo.videos.map(video => (
              <div key={video.id} className="bg-base-300 rounded-lg p-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-success"
                  checked={selectedVideos.includes(video.id)}
                  onChange={() => toggleVideoSelection(video.id)}
                  disabled={loading}
                />
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="w-24 h-auto rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate" title={video.title}>{video.title}</h4>
                  <p className="text-xs opacity-70">{video.duration}</p>
                </div>
                <button
                  className="btn btn-sm btn-success whitespace-nowrap"
                  onClick={() => handleDownloadVideo(video.url)}
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner loading-sm"></span> : "Save"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PlaylistView;
