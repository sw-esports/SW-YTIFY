const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
const app = express();
const path = require('path');
const port = process.env.PORT;
const fs = require("fs");
// Use the more reliable fork of ytdl-core
const ytdl = require("@distube/ytdl-core");
const ytpl = require('ytpl'); // For playlist support
const cors = require('cors');

// Configuration
const MAX_FOLDER_SIZE = 1024 * 1024 * 1024; // 1GB in bytes
const MAX_FILES_TO_KEEP = 10; // Fallback limit if needed

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// CORS configuration - simplified
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Serve static files for downloads
app.use('/downloads', express.static(path.join(__dirname, 'public')));

// Serve React app build files from backend/public/dist at root route
app.use(express.static(path.join(__dirname, 'public/dist')));

app.set('view-engine', 'ejs');

// API Routes
app.get("/api/yt",(req,res) => { 
    res.status(200);
    res.send("api yt");
});

function download(url, format, qualityLevel = 'high') {
    // Clean the URL to prevent duplication issues
    url = url.trim();
    
    // Remove any duplicated URLs (if URL contains the same URL twice)
    const urlPattern = /https?:\/\/[^\s]+/g;
    const matches = url.match(urlPattern);
    if (matches && matches.length > 1) {
        // Take the first valid URL
        url = matches[0];
        console.log('Cleaned duplicate URL:', url);
    }
    
    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const ext = format === 'mp3' ? 'mp3' : 'mp4';
    const filename = `download_${timestamp}.${ext}`;
    const outputPath = path.join(__dirname, 'public', filename);
    
    console.log(`Downloading: ${url} as ${format}, quality: ${qualityLevel}`);
    
    return new Promise((resolve, reject) => {
        try {
            let stream;
            const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
            
            // Enhanced options for better YouTube compatibility
            const options = {
                requestOptions: {
                    headers: {
                        'User-Agent': userAgent,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Accept-Encoding': 'gzip, deflate',
                        'DNT': '1',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1'
                    }
                }
            };
            
            if (format === 'mp3') {
                // For MP3 format (audio only)
                const quality = qualityLevel === 'low' ? 'lowestaudio' : 'highestaudio';
                
                stream = ytdl(url, { 
                    filter: 'audioonly', 
                    quality: quality,
                    ...options
                });
            } else {
                // For MP4 format (video)
                // Quality mapping
                let quality;
                switch (qualityLevel) {
                    case 'low':
                        quality = 'lowest';
                        break;
                    case 'medium':
                        quality = '18'; // 360p
                        break;
                    case 'high':
                    default:
                        quality = 'highest';
                        break;
                }
                  stream = ytdl(url, { 
                    quality: quality,
                    filter: format => format.container === 'mp4',
                    ...options
                });
            }
              // Handle stream errors before piping
            stream.on('error', (err) => {
                console.error('Stream error:', err);
                reject(err);
            });
            
            const writeStream = fs.createWriteStream(outputPath);
            writeStream.on('error', (err) => {
                console.error('Write stream error:', err);
                reject(err);
            });
            
            // Get video info for progress tracking
            let totalBytes = 0;
            let downloadedBytes = 0;
            let progressTimeout = null;
            
            ytdl.getInfo(url).then(info => {
                const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
                if (format && format.contentLength) {
                    totalBytes = parseInt(format.contentLength, 10);
                }
                
                // Setup progress tracking
                stream.on('progress', (chunkLength, downloaded, total) => {
                    if (total) {
                        totalBytes = total;
                    }
                    downloadedBytes = downloaded;
                    
                    // Log progress every second to avoid console spam
                    if (!progressTimeout) {
                        progressTimeout = setTimeout(() => {
                            const percent = (downloadedBytes / totalBytes * 100).toFixed(2);
                            console.log(`Progress: ${percent}% (${downloadedBytes}/${totalBytes})`);
                            progressTimeout = null;
                        }, 1000);
                    }
                });
            }).catch(err => {
                console.error('Error getting video info:', err);
                // Continue anyway as this is just for progress tracking
            });
              stream.pipe(writeStream)
                .on('finish', () => {
                    console.log('Download completed successfully');
                    resolve({ 
                        filename, 
                        path: outputPath,
                        format,
                        quality: qualityLevel,
                        downloadedBytes
                    });
                });
                
        } catch (err) {
            console.error('Caught error during download setup:', err);
            reject(err);
        }
    });
}

app.post("/api/yt", async (req, res) => {
    try {
        let { url, format, qualityLevel } = req.body;
        console.log("Received request:", { url, format, qualityLevel });
        
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }
        
        // Clean the URL to prevent duplication issues
        url = url.trim();
        
        // Remove any duplicated URLs (if URL contains the same URL twice)
        const urlPattern = /https?:\/\/[^\s]+/g;
        const matches = url.match(urlPattern);
        if (matches && matches.length > 1) {
            // Take the first valid URL
            url = matches[0];
            console.log('Cleaned duplicate URL, using:', url);
        }
        
        // Check if it's a playlist URL (either with list parameter or direct playlist URL)
        if (url.includes('list=') || url.includes('youtube.com/playlist')) {
            return res.status(200).json({
                success: true,
                isPlaylist: true,
                message: "This is a playlist URL. Please use the playlist feature to process this URL."
            });
        }
        
        // Validate YouTube URL
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: "Invalid YouTube URL" });
        }
        
        // Clean up files to ensure we don't exceed the storage limit
        cleanupFiles();
        
        const downloadResult = await download(url, format, qualityLevel);
        
        // Get file size information
        const filePath = path.join(__dirname, 'public', downloadResult.filename);
        let fileSize = 'Unknown';
        try {
            const stats = fs.statSync(filePath);
            // Format file size to a readable format (KB, MB, etc.)
            if (stats.size < 1024) {
                fileSize = `${stats.size} B`;
            } else if (stats.size < 1024 * 1024) {
                fileSize = `${(stats.size / 1024).toFixed(1)} KB`;
            } else {
                fileSize = `${(stats.size / (1024 * 1024)).toFixed(1)} MB`;
            }
        } catch (err) {
            console.error("Error getting file size:", err);
        }
          res.status(200).json({
            success: true,
            message: "Download successful",
            data: {
                filename: downloadResult.filename,
                downloadUrl: `/downloads/${downloadResult.filename}`,
                fileSize: fileSize
            }
        });
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({
            success: false,
            message: "Download failed",
            error: error.message
        });
    }
});


// Create a public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Serve downloaded files
app.get('/downloads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', filename);
  
  if (fs.existsSync(filePath)) {
    // Set headers to force download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Use res.download to force download behavior
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Download failed" });
        }
      }
    });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

// Function to get folder size and file info
function getFolderInfo() {
    const publicDir = path.join(__dirname, 'public');
    let totalSize = 0;
    let fileCount = 0;
    let files = [];
    
    try {
        const dirFiles = fs.readdirSync(publicDir);
        
        // Only consider download files (mp3 and mp4)
        const downloadFiles = dirFiles.filter(file => 
            file.endsWith('.mp3') || file.endsWith('.mp4')
        );
        
        downloadFiles.forEach(file => {
            const filePath = path.join(publicDir, file);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;
            fileCount++;
            files.push({
                name: file,
                path: filePath,
                size: stats.size,
                mtime: stats.mtime.getTime()
            });
        });
        
    } catch (err) {
        console.error('Error reading public directory:', err);
    }
    
    return { totalSize, fileCount, files };
}

// Function to clean up old files based on folder size limit
function cleanupFiles() {
    const folderInfo = getFolderInfo();
    
    console.log(`Current folder: ${(folderInfo.totalSize / 1024 / 1024).toFixed(2)} MB with ${folderInfo.fileCount} files`);
    
    // If folder size exceeds limit, delete oldest files
    if (folderInfo.totalSize > MAX_FOLDER_SIZE) {
        console.log(`Folder size (${(folderInfo.totalSize / 1024 / 1024).toFixed(2)} MB) exceeds limit (${(MAX_FOLDER_SIZE / 1024 / 1024).toFixed(2)} MB)`);
        
        // Sort files by modification time (oldest first for deletion)
        const sortedFiles = folderInfo.files.sort((a, b) => a.mtime - b.mtime);
        
        let currentSize = folderInfo.totalSize;
        
        // Delete files until we're under the limit
        for (const file of sortedFiles) {
            if (currentSize <= MAX_FOLDER_SIZE) break;
            
            try {
                fs.unlinkSync(file.path);
                currentSize -= file.size;
                console.log(`Deleted old file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
            } catch (err) {
                console.error(`Error deleting ${file.name}:`, err);
            }
        }
        
        console.log(`Cleanup complete. New folder size: ${(currentSize / 1024 / 1024).toFixed(2)} MB`);
    }
    
    // Fallback: Also enforce file count limit if needed
    if (folderInfo.fileCount > MAX_FILES_TO_KEEP) {
        console.log(`File count (${folderInfo.fileCount}) exceeds fallback limit (${MAX_FILES_TO_KEEP})`);
        
        const sortedFiles = folderInfo.files.sort((a, b) => a.mtime - b.mtime);
        const filesToDelete = sortedFiles.slice(0, folderInfo.fileCount - MAX_FILES_TO_KEEP);
        
        filesToDelete.forEach(file => {
            try {
                fs.unlinkSync(file.path);
                console.log(`Deleted old file (count limit): ${file.name}`);
            } catch (err) {
                console.error(`Error deleting ${file.name}:`, err);
            }
        });
    }
}

// Clean up files on startup
cleanupFiles();

// Function to extract playlist information
async function getPlaylistInfo(playlistUrl) {
    try {
        // Get playlist info
        const playlistInfo = await ytpl(playlistUrl, { limit: Infinity });
        
        // Extract useful information from each video
        const videos = playlistInfo.items.map(item => ({
            id: item.id,
            title: item.title,
            url: item.url,
            thumbnailUrl: item.bestThumbnail.url,
            duration: item.duration,
            author: item.author.name
        }));
        
        return {
            id: playlistInfo.id,
            title: playlistInfo.title,
            url: playlistInfo.url,
            videoCount: playlistInfo.estimatedItemCount,
            videos: videos
        };
    } catch (error) {
        console.error('Error fetching playlist:', error);
        throw error;
    }
}

// API endpoint for playlist information
app.get("/api/playlist", async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }
          // Check if it's a valid playlist URL (either direct playlist URL or watch URL with list parameter)
        if (!url.includes('list=') && !url.includes('youtube.com/playlist')) {
            return res.status(400).json({ error: "Not a valid YouTube playlist URL" });
        }
        
        const playlistInfo = await getPlaylistInfo(url);
        
        res.status(200).json({
            success: true,
            data: playlistInfo
        });
    } catch (error) {
        console.error("Playlist error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch playlist",
            error: error.message
        });
    }
});

// API endpoint to download a specific video from a playlist
app.post("/api/playlist/download", async (req, res) => {
    try {
        let { videoUrl, format, qualityLevel } = req.body;
        
        if (!videoUrl) {
            return res.status(400).json({ error: "Video URL is required" });
        }
        
        // Clean the URL to prevent duplication issues
        videoUrl = videoUrl.trim();
        
        // Remove any duplicated URLs (if URL contains the same URL twice)
        const urlPattern = /https?:\/\/[^\s]+/g;
        const matches = videoUrl.match(urlPattern);
        if (matches && matches.length > 1) {
            // Take the first valid URL
            videoUrl = matches[0];
            console.log('Cleaned duplicate video URL, using:', videoUrl);
        }
        
        // Clean up files to ensure we don't exceed the storage limit
        cleanupFiles();
        
        // Download the video
        const downloadResult = await download(videoUrl, format, qualityLevel);
        
        // Get file size information
        const filePath = path.join(__dirname, 'public', downloadResult.filename);
        let fileSize = 'Unknown';
        try {
            const stats = fs.statSync(filePath);
            // Format file size
            if (stats.size < 1024) {
                fileSize = `${stats.size} B`;
            } else if (stats.size < 1024 * 1024) {
                fileSize = `${(stats.size / 1024).toFixed(1)} KB`;
            } else {
                fileSize = `${(stats.size / (1024 * 1024)).toFixed(1)} MB`;
            }
        } catch (err) {
            console.error("Error getting file size:", err);
        }
        
        res.status(200).json({
            success: true,
            message: "Download successful",
            data: {
                filename: downloadResult.filename,
                downloadUrl: `/downloads/${downloadResult.filename}`,
                fileSize: fileSize
            }
        });
    } catch (error) {
        console.error("Download error:", error);
        
        // Provide more user-friendly error messages
        let errorMessage = "Download failed";
        if (error.message.includes("Video unavailable")) {
            errorMessage = "Video unavailable. This video may be private, deleted, or geo-restricted.";
        } else if (error.message.includes("UnrecoverableError")) {
            errorMessage = "Unable to access this video. It may be restricted or removed.";
        } else if (error.message.includes("403")) {
            errorMessage = "Access denied. The video may be age-restricted or private.";
        } else if (error.message.includes("404")) {
            errorMessage = "Video not found. The video may have been deleted.";
        } else if (error.message.includes("ENOTFOUND")) {
            errorMessage = "Network error. Please check your internet connection.";
        } else {
            errorMessage = error.message || "Download failed";
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: errorMessage
        });
    }
});

// API endpoint to get storage information
app.get("/api/storage", (req, res) => {
    try {
        const folderInfo = getFolderInfo();
        
        res.status(200).json({
            success: true,
            data: {
                currentSize: folderInfo.totalSize,
                currentSizeMB: parseFloat((folderInfo.totalSize / 1024 / 1024).toFixed(2)),
                maxSize: MAX_FOLDER_SIZE,
                maxSizeMB: parseFloat((MAX_FOLDER_SIZE / 1024 / 1024).toFixed(2)),
                fileCount: folderInfo.fileCount,
                maxFiles: MAX_FILES_TO_KEEP,
                usagePercentage: parseFloat(((folderInfo.totalSize / MAX_FOLDER_SIZE) * 100).toFixed(1))
            }
        });
    } catch (error) {
        console.error("Storage info error:", error);
        res.status(500).json({
            success: false,
            error: error.message        });
    }
});

// Serve React App - This should be AFTER all API routes
app.get('*', (req, res) => {
    // Don't serve React app for API routes
    if (req.path.startsWith('/api/') || req.path.startsWith('/downloads/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    const indexPath = path.join(__dirname, 'public/dist/index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('React app not built. Please place your built React app in backend/public/dist folder.');
    }
});

app.listen(port || 3000, () => {
  console.log(`Server running on port ${port || 3000}`);
});