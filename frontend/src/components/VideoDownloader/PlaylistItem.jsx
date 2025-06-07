import React from 'react';
import { FiDownload } from 'react-icons/fi';

const PlaylistItem = ({ video, selectedVideos, toggleVideoSelection, loading, handleDownloadVideo }) => {
  const isSelected = selectedVideos.includes(video.id);

  return (
    <div className={`rounded-lg p-3 flex items-center gap-3 w-full shadow-sm border transition-all ${isSelected ? 'bg-primary/10 border-primary' : 'bg-base-100 border-base-200 hover:bg-base-200'}`}>
      <input
        type="checkbox"
        className="checkbox checkbox-primary"
        checked={isSelected}
        onChange={() => toggleVideoSelection(video.id)}
        disabled={loading}
      />
      <img 
        src={video.thumbnailUrl} 
        alt={video.title} 
        className="w-20 h-auto rounded object-cover"
      />
      <div className="flex-1 overflow-hidden">
        <h4 className="text-sm font-medium truncate" title={video.title}>
          {video.title}
        </h4>
        <p className="text-xs opacity-70">{video.duration}</p>
      </div>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => handleDownloadVideo(video.url)}
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <FiDownload className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default PlaylistItem;
