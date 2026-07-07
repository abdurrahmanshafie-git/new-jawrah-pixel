import React, { StrictMode, Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';

class ErrorBoundary extends Component<{ children?: ReactNode }, { hasError: boolean; error?: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // Log error to console (or to analytics)
    // eslint-disable-next-line no-console
    console.error('Unhandled render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>Hello — App failed to render</h1>
            <p style={{ color: 'var(--text-secondary)' }}>This fallback confirms React is mounted. Check the console for errors.</p>
            <pre style={{ textAlign: 'left', maxWidth: 760, margin: '16px auto', color: 'var(--text-muted)' }}>{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children as ReactNode;
  }
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
