import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from "./utils/errorHandling";
import { ErrorScreen } from "./components/ErrorScreen/ErrorScreen"; // Add this import

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallback={<ErrorScreen />}>
    <App />
  </ErrorBoundary>
);