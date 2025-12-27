import React from 'react'
import ReactDOM from 'react-dom/client'
import Shell from './components/Shell.jsx'
import { OSProvider } from './os/store/OSProvider.jsx'
import { GlobalErrorFallback } from './os/components/GlobalErrorFallback.jsx'
import { initErrorCapture } from './utils/errorCapture'
import './index.css'

// Initialize Error Reporting Pipeline
initErrorCapture();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalErrorFallback>
            <OSProvider>
                <Shell />
            </OSProvider>
        </GlobalErrorFallback>
    </React.StrictMode>,
)
