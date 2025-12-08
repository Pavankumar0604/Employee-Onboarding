// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './hooks/useToast';
import App from './App';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { AuthProvider } from './store/AuthContext';
import { OnboardingProvider } from './store/OnboardingContext';
import { SettingsProvider } from './store/SettingsContext';

/**
 * @description Configures the TanStack Query client with default options.
 */
import { SpeedInsights } from "@vercel/speed-insights/react"
const queryClient = new QueryClient({
  /**
   * @description Default options for all queries.
   */
  defaultOptions: {
    queries: {
      /**
       * @description The time in milliseconds after which data is considered stale (5 minutes).
       */
      staleTime: 1000 * 60 * 5,
      /**
       * @description Whether to automatically refetch data when the window regains focus.
       */
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SpeedInsights />
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <SettingsProvider>
              <OnboardingProvider>
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
              </OnboardingProvider>
            </SettingsProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);