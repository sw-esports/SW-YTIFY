import "../App.css";
import { useVideoDownloader } from '../context/VideoDownloaderContext';
import UrlInput from './VideoDownloader/UrlInput';
import FormatOptions from './VideoDownloader/FormatOptions';
import ProgressBar from './VideoDownloader/ProgressBar';
import ErrorMessage from './VideoDownloader/ErrorMessage';
import DownloadInfo from './VideoDownloader/DownloadInfo';
import PlaylistView from './VideoDownloader/PlaylistView';

const InputField = () => {    // Get all state and functions from context
    const {
        url, setUrl,
        isValidUrl,
        isMp4, isMp3, handleFormatChange,
        qualityLevel, setQualityLevel,
        loading, progress,        downloadInfo, error,
        isPlaylist, playlistInfo, loadingPlaylist,
        selectedVideos,
        handleDownload,
        handlePlaylist,
        handleDownloadVideo,
        handleDownloadSelectedVideos,
        toggleVideoSelection,
        selectAllVideos,
        deselectAllVideos,
        resetDownloadState
    } = useVideoDownloader();return (
        <div className="w-full min-h-screen flex justify-center items-start sm:items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl">                <fieldset className="fieldset bg-base-200 border-base-300 rounded-lg border p-4 sm:p-6 lg:p-8 w-full shadow-lg">
                    <legend className="fieldset-legend text-xl sm:text-2xl lg:text-3xl font-bold text-primary px-4 bg-base-200 rounded-lg">
                        YouTube Video Downloader
                    </legend>
                  {/* URL Input Component - Always visible */}
                <UrlInput 
                    url={url} 
                    setUrl={setUrl} 
                    isValidUrl={isValidUrl} 
                    handleDownload={handleDownload} 
                    loading={loading || loadingPlaylist} 
                    isPlaylist={isPlaylist}
                />
                  {/* Format Options Component - Always visible */}
                <FormatOptions 
                    isMp4={isMp4} 
                    isMp3={isMp3} 
                    handleFormatChange={handleFormatChange} 
                    qualityLevel={qualityLevel} 
                    setQualityLevel={setQualityLevel} 
                    loading={loading}                />
                
                {/* Progress Bar Component */}
                {loading && <ProgressBar progress={progress} />}
                
                {/* Error Message Component */}
                <ErrorMessage error={error} />
                
                {/* Download Info Component */}
                <DownloadInfo downloadInfo={downloadInfo} />
                  {/* Divider if both download info and playlist are showing */}
                {downloadInfo && isPlaylist && <div className="divider mt-4 mb-0"></div>}                {/* Playlist Component */}
                {isPlaylist && (
                    <PlaylistView 
                        playlistInfo={playlistInfo}
                        loadingPlaylist={loadingPlaylist}
                        selectedVideos={selectedVideos}
                        loading={loading}
                        progress={progress}
                        downloadInfo={downloadInfo}
                        selectAllVideos={selectAllVideos}
                        deselectAllVideos={deselectAllVideos}
                        toggleVideoSelection={toggleVideoSelection}
                        handleDownloadVideo={handleDownloadVideo}
                        handleDownloadSelectedVideos={handleDownloadSelectedVideos}
                        resetDownloadState={resetDownloadState}
                    />                )}
                </fieldset>
            </div>
        </div>
    );
};

export default InputField;
