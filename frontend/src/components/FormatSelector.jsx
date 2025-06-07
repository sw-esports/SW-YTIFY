import React from 'react';

const FormatSelector = ({ isMp4, isMp3, qualityLevel, handleFormatChange, setQualityLevel, loading }) => {
  return (
    <div className="w-full flex flex-col gap-2 mt-2 p-2 bg-base-300 rounded-box">
      <div className="text-sm font-semibold mb-1">Format Options:</div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <input 
            type="radio" 
            id="mp4" 
            name="format" 
            className="radio radio-sm radio-primary" 
            checked={isMp4}
            onChange={() => handleFormatChange('mp4')}
            disabled={loading}
          />
          <label className="text-[0.9rem] cursor-pointer" htmlFor="mp4">MP4 (Video)</label>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="radio" 
            id="mp3" 
            name="format" 
            className="radio radio-sm radio-primary" 
            checked={isMp3}
            onChange={() => handleFormatChange('mp3')}
            disabled={loading}
          />
          <label className="text-[0.9rem] cursor-pointer" htmlFor="mp3">MP3 (Audio)</label>
        </div>
      </div>
      
      {isMp4 && (
        <div className="mt-2">
          <div className="text-sm mb-1">Quality:</div>
          <select 
            className="select select-bordered select-sm w-full" 
            value={qualityLevel} 
            onChange={(e) => setQualityLevel(e.target.value)}
            disabled={loading}
          >
            <option value="high">High (720p or better)</option>
            <option value="medium">Medium (360p)</option>
            <option value="low">Low (240p or less)</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default FormatSelector;
