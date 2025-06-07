import React from 'react';
import { FiVideo, FiMusic, FiMonitor } from 'react-icons/fi';

const FormatOptions = ({ 
  isMp4, 
  isMp3, 
  handleFormatChange, 
  qualityLevel, 
  setQualityLevel, 
  loading 
}) => {  return (
    <div className="w-full flex flex-col gap-3 mt-3 p-4 bg-base-300 rounded-lg">
      <div className="text-sm font-semibold mb-1 flex items-center gap-2">
        <FiMonitor className="h-4 w-4" />
        Format Options
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3 p-0">
            <input 
              type="radio" 
              name="format" 
              className="radio radio-primary" 
              checked={isMp4}
              onChange={() => handleFormatChange('mp4')}
              disabled={loading}
            />
            <span className="label-text font-medium flex items-center gap-2">
              <FiVideo className="h-4 w-4" />
              MP4 (Video)
            </span>
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3 p-0">
            <input 
              type="radio" 
              name="format" 
              className="radio radio-primary" 
              checked={isMp3}
              onChange={() => handleFormatChange('mp3')}
              disabled={loading}
            />
            <span className="label-text font-medium flex items-center gap-2">
              <FiMusic className="h-4 w-4" />
              MP3 (Audio)
            </span>
          </label>
        </div>
      </div>
      
      {isMp4 && (
        <div className="mt-2">
          <div className="text-sm font-medium mb-2">
            Quality
          </div>
          <select 
            className="select select-bordered select-primary w-full" 
            value={qualityLevel} 
            onChange={(e) => setQualityLevel(e.target.value)}
            disabled={loading}
          >
            <option value="high">High Quality (720p or better)</option>
            <option value="medium">Medium Quality (360p)</option>
            <option value="low">Low Quality (240p or less)</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default FormatOptions;
