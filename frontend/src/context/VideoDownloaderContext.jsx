import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';

// Create context
const VideoDownloaderContext = createContext();

// Custom hook to use the context
export const useVideoDownloader = () => {
  const context = useContext(VideoDownloaderContext);
  if (!context) {
    throw new Error('useVideoDownloader must be used within a VideoDownloaderProvider');
  }
  return context;
};

// Provider component
export const VideoDownloaderProvider = ({ children }) => {
  // URL and validation
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  
  // Format options
  const [isMp4, setIsMp4] = useState(true);
  const [isMp3, setIsMp3] = useState(false);
  const [qualityLevel, setQualityLevel] = useState("high");
  
  // Loading and progress states
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Result states
  const [downloadInfo, setDownloadInfo] = useState(null);
  const [error, setError] = useState(null);
    // Playlist related states
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);

  // Storage related states
  const [storageInfo, setStorageInfo] = useState(null);
  const [loadingStorage, setLoadingStorage] = useState(false);

  // Format change handler
  const handleFormatChange = (format) => {
    if (format === 'mp4') {
      setIsMp4(true);
      setIsMp3(false);
    } else {
      setIsMp4(false);
      setIsMp3(true);
    }
  };
  
  // YouTube URL validation function
  const validateYoutubeUrl = (url) => {
    if (!url) return false;
    
    // Check for standard video URLs (watch?v=VIDEO_ID)
    const videoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/;
    
    // Check for playlist URLs (both youtube.com/playlist and watch with list parameter)
    const playlistRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/(playlist\?list=|watch\?.*list=)([a-zA-Z0-9_-]+)(&.*)?$/;
    
    return videoRegex.test(url) || playlistRegex.test(url);
  };
  
  // Validate URL when it changes
  useEffect(() => {
    if (url.trim() === '') {
      setIsValidUrl(true); // Empty state is considered valid for UI purposes
      return;
    }
    setIsValidUrl(validateYoutubeUrl(url));
  }, [url]);
  
  // Reset states
  const resetStates = () => {
    setError(null);
    setDownloadInfo(null);
    setProgress(0);
    setIsPlaylist(false);
    setPlaylistInfo(null);
  };
    // Handle single video download
  const handleDownload = async () => {
    resetStates();
    
    // Validate URL
    if (!url) {
      setError("Please enter a YouTube URL");
      return;
    }
    
    if (!validateYoutubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }
    
    // Check if it's a playlist URL
    if (url.includes('list=') || url.includes('youtube.com/playlist')) {
      await handlePlaylist();
      return;
    }
    
    setLoading(true);
    
    try {
      const format = isMp4 ? 'mp4' : 'mp3';
      console.log("Sending request to backend:", { url, format, qualityLevel });
      
      // Simulate progress as we can't get real-time progress from the backend easily
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newValue = prev + Math.random() * 10;
          // Cap at 95% since we don't know exactly when it will finish
          return newValue > 95 ? 95 : newValue;
        });
      }, 500);
      
      const response = await fetch(`${API_BASE_URL}/api/yt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, format, qualityLevel })
      });
      
      // Clear progress simulation
      clearInterval(progressInterval);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Download failed');
      }
      
      // Check if it's a playlist URL that was detected by the backend
      if (data.isPlaylist) {
        await handlePlaylist();
        return;
      }
      
      // Set progress to 100% on success
      setProgress(100);
      setDownloadInfo(data.data);
      
      // Update storage info after download
      fetchStorageInfo();
    } catch (error) {
      console.error("Download error:", error);
      setError(error.message || "Failed to download. Please try again.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle playlist URL
  const handlePlaylist = async () => {
    setLoadingPlaylist(true);
    setIsPlaylist(true);
    setError(null);
    
    try {
      // Fetch playlist info
      const response = await fetch(`${API_BASE_URL}/api/playlist?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch playlist');
      }
      
      setPlaylistInfo(data.data);
      // Initialize with no videos selected
      setSelectedVideos([]);
      
    } catch (error) {
      console.error("Playlist error:", error);
      setError(error.message || "Failed to fetch playlist information");
      setIsPlaylist(false);
    } finally {
      setLoadingPlaylist(false);
    }
  };
  
  // Handle downloading a specific video from playlist
  const handleDownloadVideo = async (videoUrl) => {
    setLoading(true);
    setError(null);
    setDownloadInfo(null);
    setProgress(0);
    
    try {
      const format = isMp4 ? 'mp4' : 'mp3';
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newValue = prev + Math.random() * 10;
          return newValue > 95 ? 95 : newValue;
        });      }, 500);
      
      const response = await fetch(`${API_BASE_URL}/api/playlist/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoUrl, format, qualityLevel })
      });
      
      clearInterval(progressInterval);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Download failed');
      }
        setProgress(100);
      setDownloadInfo(data.data);
      
      // Update storage info after download
      fetchStorageInfo();
    } catch (error) {
      console.error("Video download error:", error);
      setError(error.message || "Failed to download video");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };
    // Download multiple selected videos
  const handleDownloadSelectedVideos = async () => {
    if (selectedVideos.length === 0) {
      setError("Please select at least one video");
      return;
    }
    
    setLoading(true);
    setError(null);
    setDownloadInfo(null);
    
    // Get the selected video URLs and titles
    const selectedVideoData = playlistInfo.videos
      .filter(video => selectedVideos.includes(video.id));
    
    let successCount = 0;
    let failedCount = 0;
    const downloadUrls = [];
    const downloadedFiles = [];
    
    // Set progress to 0
    setProgress(0);
    
    // Process videos one by one
    for (let i = 0; i < selectedVideoData.length; i++) {
      try {
        const format = isMp4 ? 'mp4' : 'mp3';
        const videoUrl = selectedVideoData[i].url;
        const videoTitle = selectedVideoData[i].title;
        
        // Update progress based on completed videos        setProgress((i / selectedVideoData.length) * 100);
        
        const response = await fetch(`${API_BASE_URL}/api/playlist/download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ videoUrl, format, qualityLevel })
        });
        
        const data = await response.json();
        
        if (response.ok && data.data) {
          successCount++;
          downloadUrls.push(data.data.downloadUrl);
          downloadedFiles.push({
            title: videoTitle,
            filename: data.data.filename,
            downloadUrl: data.data.downloadUrl,
            fileSize: data.data.fileSize
          });
        } else {
          failedCount++;
          console.error("Download failed for video:", videoTitle, data.error);
        }
        
      } catch (error) {
        console.error("Video download error:", error);
        failedCount++;
      }
    }
    
    // Set progress to 100% when done
    setProgress(100);
      // Show summary and download info
    if (successCount > 0) {
      // Calculate total file size properly
      let totalSizeBytes = 0;
      let totalSizeFormatted = '';
      
      if (downloadedFiles.length > 0) {
        // Extract numeric values from file sizes and sum them up
        downloadedFiles.forEach(file => {
          if (file.fileSize && typeof file.fileSize === 'string') {
            const sizeMatch = file.fileSize.match(/^([\d.]+)\s*(B|KB|MB|GB)?$/i);
            if (sizeMatch) {
              const value = parseFloat(sizeMatch[1]);
              const unit = (sizeMatch[2] || 'B').toUpperCase();
              
              switch (unit) {
                case 'B':
                  totalSizeBytes += value;
                  break;
                case 'KB':
                  totalSizeBytes += value * 1024;
                  break;
                case 'MB':
                  totalSizeBytes += value * 1024 * 1024;
                  break;
                case 'GB':
                  totalSizeBytes += value * 1024 * 1024 * 1024;
                  break;
              }
            }
          }
        });
        
        // Format total size
        if (totalSizeBytes < 1024) {
          totalSizeFormatted = `${totalSizeBytes.toFixed(1)} B`;
        } else if (totalSizeBytes < 1024 * 1024) {
          totalSizeFormatted = `${(totalSizeBytes / 1024).toFixed(1)} KB`;
        } else if (totalSizeBytes < 1024 * 1024 * 1024) {
          totalSizeFormatted = `${(totalSizeBytes / (1024 * 1024)).toFixed(1)} MB`;
        } else {
          totalSizeFormatted = `${(totalSizeBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
        }
      }
      
      setDownloadInfo({
        filename: `${successCount} video${successCount > 1 ? 's' : ''} downloaded successfully`,
        fileSize: totalSizeFormatted || 'Unknown',
        downloadUrl: downloadUrls[0], // Primary download URL for compatibility
        downloadUrls: downloadUrls, // All download URLs
        downloadedFiles: downloadedFiles, // Detailed info about each file
        multipleFiles: successCount > 1
      });
      
      if (failedCount > 0) {
        setError(`${failedCount} video${failedCount > 1 ? 's' : ''} failed to download`);
      }
    } else {
      setError("All downloads failed. Please try again.");
    }
      setLoading(false);
    
    // Update storage info after downloads
    fetchStorageInfo();
  };
  
  // Toggle video selection in playlist
  const toggleVideoSelection = (videoId) => {
    setSelectedVideos(prev => {
      if (prev.includes(videoId)) {
        return prev.filter(id => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });
  };
  
  // Select all videos in playlist
  const selectAllVideos = () => {
    if (playlistInfo && playlistInfo.videos) {
      setSelectedVideos(playlistInfo.videos.map(video => video.id));
    }
  };
    // Deselect all videos in playlist
  const deselectAllVideos = () => {
    setSelectedVideos([]);
  };
  // Reset download state to allow new downloads
  const resetDownloadState = () => {
    setDownloadInfo(null);
    setError(null);
    setProgress(0);
  };

  // Fetch storage information
  const fetchStorageInfo = async () => {
    setLoadingStorage(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/storage`);
      const data = await response.json();
      
      if (response.ok) {
        setStorageInfo(data.data);
      } else {
        console.error("Failed to fetch storage info:", data.error);
      }
    } catch (error) {
      console.error("Storage info error:", error);
    } finally {
      setLoadingStorage(false);
    }
  };

  // Fetch storage info on component mount
  useEffect(() => {
    fetchStorageInfo();
  }, []);
  // Context value
  const value = {
    url, setUrl,
    isValidUrl,
    isMp4, isMp3, handleFormatChange,
    qualityLevel, setQualityLevel,
    loading, progress,
    downloadInfo, error,
    isPlaylist, playlistInfo, loadingPlaylist,
    selectedVideos,
    storageInfo, loadingStorage, fetchStorageInfo,
    handleDownload,
    handlePlaylist,
    handleDownloadVideo,
    handleDownloadSelectedVideos,
    toggleVideoSelection,
    selectAllVideos,
    deselectAllVideos,
    resetDownloadState
  };

  return (
    <VideoDownloaderContext.Provider value={value}>
      {children}
    </VideoDownloaderContext.Provider>
  );
};

export default VideoDownloaderContext;
