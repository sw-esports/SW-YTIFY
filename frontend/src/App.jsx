
import InputField from './components/InputField'
import { VideoDownloaderProvider } from './context/VideoDownloaderContext'

const App = () => {
  return (
    <VideoDownloaderProvider>
      <div className="min-h-screen bg-base-100">
        <InputField />
      </div>
    </VideoDownloaderProvider>
  )
}

export default App