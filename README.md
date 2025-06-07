# YouTube Video Downloader

A full-stack application for downloading YouTube videos with a React frontend and Express backend.

## Project Structure

This project uses a monorepo approach with two main directories:
- `frontend`: React application built with Vite and Tailwind CSS
- `backend`: Express server for handling YouTube API interactions and downloads

## Development Setup

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/yt-video-downloader.git
cd yt-video-downloader
npm run install:all
```

### Running the Application

Start both frontend and backend with a single command:

```bash
npm run dev
```

This will start:
- Frontend server at http://localhost:5173
- Backend server at http://localhost:3000

### Individual Services

To run services individually:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## Production Build

```bash
npm run build
```

## Deployment

This project is configured for:

### Frontend
- Deploy to Netlify using the `netlify.toml` configuration
- Connect your GitHub repo to Netlify and it will automatically build based on the configuration

### Backend
- Deploy to Render or a similar service
- Use the included `Procfile` for Render deployment
- Set the necessary environment variables including `FRONTEND_URL` pointing to your Netlify deployment

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
# Add any other required variables
```

## License

[MIT](LICENSE)
