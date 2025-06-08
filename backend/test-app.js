const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Static files
app.use(express.static(path.join(__dirname, 'public/dist')));

// API route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API working' });
});

// Fallback route
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    const indexPath = path.join(__dirname, 'public/dist/index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('React app not built. Please place your built React app in backend/public/dist folder.');
    }
});

app.listen(port, () => {
    console.log(`Test server running on port ${port}`);
});
